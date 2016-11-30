import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {
    getAnswersByQuestionTestPlayerUrl,
    checkSAnswerUrl,
    navButtonConstClassName,
    getTimeStampUrl,
    saveEndTimeUrl,
    getEndTimeUrl,
    resetSessionDataUrl,
    getTestRecordUrl,
    countTestPassesByStudentUrl,
    modalInfoParams
}  from "../constant";
import {
    TestPlayerNavButton,
    TestPlayerQuestions,
    TestPlayerDtapiResult,
    TestDetail,
    TestPlayerAnswers
} from "../classes";
import {SubjectService} from "./subject.service";
import {CRUDService} from "./crud.service";
import {CommonService} from "./common.service";
import {DtapiResponse} from "../classes/dtapi-response";

@Injectable()
export class TestPlayerService {
    private getAnswersByQuestionUrl: string = getAnswersByQuestionTestPlayerUrl;
    private checkSAnswerUrl: string = checkSAnswerUrl;
    private getTimeStampUrl: string = getTimeStampUrl;
    private saveEndTimeUrl: string = saveEndTimeUrl;
    private getEndTimeUrl: string = getEndTimeUrl;
    private getTestRecordUrl: string = getTestRecordUrl;
    private resetSessionDataUrl: string = resetSessionDataUrl;
    private countTestPassesByStudentUrl: string = countTestPassesByStudentUrl;
    private navButtonConstClassName: string = navButtonConstClassName;
    private headersCheckSAnswer = new Headers({"content-type": "application/json"});
    private modalParams: any = modalInfoParams;

    private testId: number;
    private studentId: number;
    private navButtons: TestPlayerNavButton[];
    private questions: TestPlayerQuestions[] = [];
    private tasksCount: number = 0;
    private timeForTest: number;
    private timer: any = {};
    private maxUserRate: number = 0;
    private userRate: number = 0;
    private precisionTime: number = 5;
    private countAttempts: boolean = true;

    constructor(private http: Http,
                private router: Router,
                private subjectService: SubjectService,
                private crudService: CRUDService,
                private commonService: CommonService) {
    };

    private handleError = (error: any) => {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "Server error";
        if (error.status === 403) {
            sessionStorage.removeItem("userRole");
            this.router.navigate(["/login"]);
        }
        return Observable.throw(errMsg);
    };

    private successResponse = (response: Response) => response.json();

    getAnswersByQuestion(questionId: string): Observable<any> {
        return this.http
            .get(`${this.getAnswersByQuestionUrl}/${questionId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    checkSAnswers(questions: TestPlayerQuestions[], startTime: number, endTime: number) {
        let body = this.createBodyCheck(questions);
        this.http
            .post(this.checkSAnswerUrl, JSON.stringify(body), {headers: this.headersCheckSAnswer})
            .map(this.successResponse)
            .catch(this.handleError)
            .subscribe((results: TestPlayerDtapiResult[]) => {
                this.userRate = this.getUserRate(results, questions);
                const saveResConfig: any = {
                    userRate: this.userRate,
                    startTime,
                    endTime,
                    questions,
                    results
                };
                this.saveResults(saveResConfig);
            });
    }

    failTestByTimer(questions: TestPlayerQuestions[], startTime: number, endTime: number) {
        let userRate: number = 0;
        const results: TestPlayerDtapiResult[] = [{question_id: "-1", true: 0}];
        const saveResConfig: any = {userRate, startTime, endTime, questions, results};

        questions.forEach(question => {
            question.chosenAnswer = {};
        });
        this.saveResults(saveResConfig);
    }

    saveResults(saveResConfig: any) {
        let message: string = saveResConfig.results[0].question_id === "-1" ?
            `Тест закінчено поза межами відведеного часу. Ваша оцінка становить 0 балів.` :
            `Кількість набраних Вами балів становить: ${this.userRate} з ${this.maxUserRate} максимально можливих`;
        const bodyResultParams: any = {
            studentId: this.studentId,
            testId: this.testId,
            startTime: saveResConfig.startTime,
            endTime: saveResConfig.endTime,
            results: [],
            userRate: saveResConfig.userRate,
            questions: saveResConfig.questions,
            maxUserRate: this.maxUserRate
        };
        let bodyResult: any = this.createBodyResult(bodyResultParams);
        this.crudService.insertData("result", bodyResult)
            .subscribe(() => {
                    localStorage.removeItem("dTester");
                    this.resetSessionData();
                    this.commonService.openModalInfo(message, "info", "Результат тестування!")
                        .then(this.handleReject,
                            () => {
                                this.router.navigate(["/student"]);
                            });
                },
                () => {
                    this.commonService.openModalInfo(...this.modalParams.mistakeDuringSaveResult);
                });
    }

    setBaseTestData(testId: number, studentId: number, maxUserRate: number) {
        this.testId = testId;
        this.studentId = studentId;
        this.maxUserRate = maxUserRate;
    }

    private getTestRecord(): Observable<any> {
        return this.http
            .get(`${this.getTestRecordUrl}/${this.testId}`)
            .map(response => {
                let testRecord = response.json();
                if (testRecord.response && testRecord.response === "no records") {
                    throw new Error("test does not exist");
                }
                this.timeForTest = +testRecord[0].time_for_test * 60;
                this.tasksCount = +testRecord[0].tasks;
                this.timer = this.createTimeForView(this.timeForTest);
                return testRecord;
            })
            .catch(this.handleError);
    }

    countTestPassesByStudent = (testRecord: any): Observable<any> => {
        this.countAttempts = true;
        return this.http
            .get(`${this.countTestPassesByStudentUrl}/${this.studentId}/${this.testId}`)
            .map(this.successResponse)
            .catch(this.handleError)
            .do(countTestPassed => {
                if (+countTestPassed.numberOfRecords >= +testRecord[0].attempts) {
                    throw new Error("attempts ended");
                }
            });
    };

    getTestDetails = () => {
        this.maxUserRate = 0;
        return this.subjectService.getTestDetailsByTest(this.testId)
            .map((testDetails: TestDetail[] | DtapiResponse) => {
                if ((testDetails as DtapiResponse).response && (testDetails as DtapiResponse).response === "no records") {
                    throw new Error("test data are absent");
                }
                (testDetails as TestDetail[]).forEach((data: TestDetail) => {
                    this.maxUserRate += +data.tasks * +data.rate;
                });
                return testDetails;
            });
    };

    getQuestions = (testDetails: any[]) => {
        this.questions = [];
        let forkJoinBatch: Observable<any>[] = testDetails.map(item => {
            return this.subjectService.getQuestionsByLevelRand(item.test_id, item.level, item.tasks);
        });
        return Observable.forkJoin(forkJoinBatch)
            .map((questions: TestPlayerQuestions[][] | any) => {
                let error = questions.some((item) => {
                    return item.response;
                });
                if (error) {
                    throw new Error("test data are absent");
                }
                this.questions = this.prepareQuestionForTest(<TestPlayerQuestions[][]>questions, testDetails);
                this.randomSortArrayOfObjects(this.questions, "question_id");
                this.navButtons = this.createNavButtons(this.questions.length);
                return this.questions;
            });

    };

    prepareQuestionForTest(questions: TestPlayerQuestions[][], testDetails: any[]): TestPlayerQuestions[] {
        let tempArr: TestPlayerQuestions[] = [];

        questions.forEach((elem: TestPlayerQuestions[]) => {
            tempArr.push(...elem);
        });
        return tempArr.map((question: TestPlayerQuestions, i: number) => {
            question.chosenAnswer = {};
            for (let i = 0; i < testDetails.length; i++) {
                if (question.level === testDetails[i].level) {
                    question.rate = testDetails[i].rate + "";
                    break;
                }
            }
            question.type = question.type === "1" ? "radio" : "checkbox";
            question.answered = false;
            question.active = !i;
            return question;
        });
    }

    getAnswers = (questions) => {
        const forkJoinBatch = questions.map(question => {
            return this.getAnswersByQuestion(question.question_id);
        });

        return Observable.forkJoin(forkJoinBatch)
            .do((answers: any[][] | any) => {
                let error = answers.some(item => {
                    return item.response;
                });
                if (error) {
                    throw new Error("test data are absent");
                }
                answers.forEach((item, i) => {
                    this.randomSortArrayOfObjects(item, "answer_id");
                    questions[i].answers = item;
                });
            });

    };

    createTimeStamp = () => {
        return this.getTimeStamp()
            .map(timeStamp => {
                timeStamp.curtime = +timeStamp.unix_timestamp + this.timeForTest;
                return timeStamp;
            });
    };

    returnTestData = () => {
        return {
            navButtons: this.navButtons,
            questions: this.questions,
            tasksCount: this.tasksCount,
            timeForTest: this.timeForTest,
            maxUserRate: this.maxUserRate,
            timer: this.timer
        };
    };

    getNewTest() {
        return this.getTestRecord()
            .flatMap(this.countTestPassesByStudent)
            .flatMap(this.getTestDetails)
            .flatMap(this.getQuestions)
            .flatMap(this.getAnswers)
            .flatMap(this.createTimeStamp)
            .flatMap(this.saveEndTime)
            .map(this.returnTestData);
    }

    recoverQuestions = (testDetails: any[]) => {
        let forkJoinBatch: Observable<any>[] = this.questions.map(item => {
            return this.crudService.getRecordById("question", item.question_id);
        });

        return Observable.forkJoin(forkJoinBatch)
            .do((questions: TestPlayerQuestions[][]) => {
                this.prepareQuestionsForContinueTest(questions, testDetails);
                this.recoverNavButtons();
            });

    };

    prepareQuestionsForContinueTest(questions, testDetails) {
        this.questions.forEach((item, j) => {
            item.question_text = questions[j][0].question_text;
            item.attachment = questions[j][0].attachment;
            item.level = questions[j][0].level;
            item.type = questions[j][0].type === "1" ? "radio" : "checkbox";
            testDetails.forEach((elem) => {
                if (elem.level === item.level) {
                    item.rate = elem.rate + "";
                }
            });
        });
    }

    recoverNavButtons() {
        this.navButtons = this.questions.map((question, i) => {
            let button: any = {};
            button.active = question.active;
            button.answered = question.answered;
            button.label = this.commonService.leftPad(i + 1);
            if (button.active) {
                button.className = `${navButtonConstClassName} btn-warning`;
            } else if (button.answered) {
                button.className = `${navButtonConstClassName} btn-success`;
            } else {
                button.className = `${navButtonConstClassName} btn-primary`;
            }
            return button;
        });
    }

    recoverAnswers = () => {
        let forkJoinBatch: Observable<any>[] = this.questions.map(item => {
            return this.getAnswersByQuestion(item.question_id);
        });

        return Observable.forkJoin(forkJoinBatch)
            .do((answers) => {
                this.prepareAnswersForContinueTest(answers);
            });
    };

    prepareAnswersForContinueTest(answers) {
        this.questions.forEach((question, j) => {
            question.answers.forEach(answer => {
                answers[j].forEach(elem => {
                    if (answer.answer_id === elem.answer_id) {
                        answer.answer_text = elem.answer_text;
                        answer.attachment = elem.attachment;
                    }
                });
            });
        });
    }

    recoverTestData() {
        const dTester = JSON.parse(localStorage.getItem("dTester"));
        this.studentId = +sessionStorage.getItem("userId");
        this.testId = dTester.testId;
        this.questions = dTester.questions;
        return this.getTestRecord()
            .flatMap(this.getTestDetails)
            .flatMap(this.recoverQuestions)
            .flatMap(this.recoverAnswers)
            .map(this.returnTestData);
    }

    randomSortArrayOfObjects(arr: Object[], property: string): any {
        arr.sort((a, b) => {
            return Math.random() > 0.5 ? +a[property] - +b[property] : +b[property] - +a[property];
        });

    }

    getTimeStamp(): Observable < any > {
        return this.http
            .get(this.getTimeStampUrl)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    saveEndTime = (body: any) => {
        return this.http
            .post(this.saveEndTimeUrl, JSON.stringify(body), {headers: this.headersCheckSAnswer})
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getEndTime(): Observable < any > {
        return this.http
            .get(this.getEndTimeUrl)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    resetSessionData() {
        this.http
            .get(this.resetSessionDataUrl)
            .map(this.successResponse)
            .catch(this.handleError)
            .subscribe();
    }

    createNavButtons(countOfButtons: number): TestPlayerNavButton[] {
        let navButtons: TestPlayerNavButton[] = [];

        for (let i = 0; i < countOfButtons; i++) {
            navButtons.push(new TestPlayerNavButton());
            navButtons[i].label = this.commonService.leftPad(i + 1);
            if (!i) {
                navButtons[i].active = true;
                navButtons[i].className = `${navButtonConstClassName} btn-warning`;
            } else {
                navButtons[i].className = `${navButtonConstClassName} btn-primary`;
            }
        }
        return navButtons;
    }

    changeNavButtons(num: number, navButtons: TestPlayerNavButton[], activeQuestion: number): number {
        navButtons[activeQuestion].active = false;
        navButtons[activeQuestion].className = navButtons[activeQuestion].answered ?
            `${navButtonConstClassName} btn-success` :
            `${navButtonConstClassName} btn-primary`;
        activeQuestion = num;
        navButtons[activeQuestion].className = `${navButtonConstClassName} btn-warning`;
        navButtons[activeQuestion].active = true;
        return activeQuestion;
    }

    getUserRate(results: TestPlayerDtapiResult[], questions: TestPlayerQuestions[]): number {
        let userRate: number = 0;

        results.forEach((result) => {
            if (!result.true) return;
            questions.forEach((question) => {
                if (result.question_id === question.question_id) {
                    userRate += +question.rate;
                }
            });
        });
        return userRate;
    }

    createBodyCheck(questions: TestPlayerQuestions[]) {
        return questions.map(question => {
            let data: any = {};
            data.question_id = question.question_id;
            data.answer_ids = [];
            for (let key in question.chosenAnswer) {
                if (question.chosenAnswer[key]) {
                    data.answer_ids.push(key);
                }
            }
            return data;
        });
    }

    createTimeForView(restOfTime: number) {
        restOfTime = restOfTime <= 0 ? 0 : restOfTime;
        let hours: number = restOfTime / 3600 ^ 0;
        let min: number = (restOfTime - hours * 60) / 60 ^ 0;
        let sec: number = (restOfTime - hours * 3600 - min * 60);
        return {
            hours: this.commonService.leftPad(hours),
            min: this.commonService.leftPad(min),
            sec: this.commonService.leftPad(sec)
        };
    }

    findUnAsweredQuestion(activeQuestion: number, navButtons: TestPlayerNavButton[]): number {
        let k: number = activeQuestion + 1;
        for (let j = 0; j < navButtons.length; j++) {
            k = k === navButtons.length ? 0 : k;
            if (!navButtons[k].answered) {
                return k;
            } else {
                k++;
            }
        }
    }

    createBodyResult(bodyResultParams: any): any {
        let bodyResult: any = {};
        let date = new Date(bodyResultParams.startTime * 1000);
        let dateEnd = new Date(bodyResultParams.endTime * 1000);

        bodyResult.true_answers = "";
        bodyResult.answers = bodyResultParams.maxUserRate;
        bodyResult.student_id = bodyResultParams.studentId;
        bodyResult.test_id = bodyResultParams.testId;
        bodyResult.session_date = this.commonService.createSQLDate(date, "date", "-");
        bodyResult.start_time = this.commonService.createSQLDate(date, "time", ":");
        bodyResult.end_time = this.commonService.createSQLDate(dateEnd, "time", ":");
        bodyResult.result = bodyResultParams.userRate;
        bodyResult.questions = [];
        if (!bodyResultParams.results.length) {
            bodyResult.questions = bodyResultParams.questions.map(item => {
                return {question_id: item.question_id};
            });
        } else {
            bodyResult.questions = bodyResultParams.questions.map((item) => {
                let question: any = {};
                question.question_id = item.question_id;
                question.answers = [];
                for (let key in item.chosenAnswer) {
                    if (item.chosenAnswer[key]) {
                        question.answers.push(key);
                    }
                }
                bodyResultParams.results.forEach(result => {
                    if (result.question_id === item.question_id) {
                        question.true = result.true;
                    }
                });
                return question;
            });
        }
        bodyResult.questions = JSON.stringify(bodyResult.questions);
        return bodyResult;
    }

    createBackup(questions: TestPlayerQuestions[]) {
        let dTester: any = {};
        dTester.testId = this.testId;
        dTester.userId = this.commonService.cryptData(this.studentId);
        dTester.questions = questions.map((question: TestPlayerQuestions) => {
            let backupQuestion: any = {};
            backupQuestion.active = question.active;
            backupQuestion.question_id = question.question_id;
            backupQuestion.answered = question.answered;
            backupQuestion.chosenAnswer = question.chosenAnswer;
            backupQuestion.answers = question.answers.map((answer: TestPlayerAnswers) => {
                return {answer_id: answer.answer_id};
            });
            return backupQuestion;
        });
        localStorage.setItem("dTester", JSON.stringify(dTester));
    }

    getSavedTime = (timeEndOfTest) => {
        return Observable.create(observer => {
            this.getEndTime()
                .subscribe(savedEndOfTest => {
                    observer.next({timeEndOfTest, savedEndOfTest});
                }, this.errorSavedTime);
        });
    }

    errorSavedTime = () => {
        this.commonService.openModalInfo(...this.modalParams.impossibleRecoverTest)
            .then(this.handleReject,
                () => {
                    localStorage.removeItem("dTester");
                    this.router.navigate(["/student"]);
                });
    }

    compareTime = (times) => {
        let startTime = +times.savedEndOfTest.unix_timestamp;
        let endTime = +times.timeEndOfTest.unix_timestamp;

        return Observable.create(observer => {
            if (+times.savedEndOfTest.curtime + this.precisionTime > endTime) {
                const restOfTime: number = +times.savedEndOfTest.curtime - +times.timeEndOfTest.unix_timestamp;
                observer.next({checkResult: true, startTime, endTime, restOfTime});
            } else {
                observer.next({checkResult: false, startTime, endTime});
            }
        });
    }

    checkTimer() {
        return this.getTimeStamp()
            .flatMap(this.getSavedTime)
            .flatMap(this.compareTime);
    }

    handleReject = () => {
    };

}