import {Injectable} from "@angular/core";
import {Location} from "@angular/common";
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
    countTestPassesByStudentUrl
}  from "../constant";
import {TestPlayerNavButton} from "../classes/test-player-nav-buttons";
import {TestPlayerQuestions} from "../classes/test-player-questions";
import {TestPlayerDtapiResult} from "../classes/test-player-dtapi-result";
import {TestDetail} from "../classes/test-detail";
import {ConfigModalInfo} from "../classes/configs/config-modal-info";
import {InfoModalComponent} from "../components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SubjectService} from "./subject.service";
import {TestPlayerAnswers} from "../classes/test-player-answers";
import {CRUDService} from "./crud.service";

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

    private testId: number;
    private studentId: number;
    private navButtons: TestPlayerNavButton[];
    private questions: TestPlayerQuestions[] = [];
    private tasksCount: number = 0;
    private timeForTest: number;
    private timer: any = {};
    private maxUserRate: number = 0;

    constructor(private http: Http,
                private router: Router,
                private modalService: NgbModal,
                private subjectService: SubjectService,
                private crudService: CRUDService,
                private location: Location) {
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
                let userRate = this.getUserRate(results, questions);
                this.resetSessionData();
                const saveResConfig: any = {userRate, startTime, endTime, questions, results};
                this.saveResults(saveResConfig);
                this.openModalInfo(`Кількість набраних Вами балів становить: ${userRate} з ${this.maxUserRate} 
                максимально можливих`, "info", "Результат тестування!")
                    .then(null, () => {
                        this.location.back();
                    });
            });
    }

    failTestByTimer(questions: TestPlayerQuestions[], startTime: number, endTime: number) {
        let userRate: number = 0;
        questions.forEach(question => {
            question.chosenAnswer = {};
        });
        const saveResConfig: any = {userRate, startTime, endTime, questions, results: []};
        this.saveResults(saveResConfig);
        this.resetSessionData();
        this.openModalInfo(`Тест закінчено поза межами відведеного часу.  
        Ваша оцінка становить 0 балів.`, "info", "Результат тестування!")
            .then(null, () => {
                this.location.back();
            });
    }

    saveResults(saveResConfig: any) {
        const bodyResultParams: any = {
            studentId: this.studentId,
            testId: this.testId,
            startTime: saveResConfig.startTime,
            endTime: saveResConfig.endTime,
            results: saveResConfig.results,
            userRate: saveResConfig.userRate,
            questions: saveResConfig.questions,
            maxUserRate: this.maxUserRate
        };
        let bodyResult: any = this.createBodyResult(bodyResultParams);
        localStorage.removeItem("dTester");
        this.crudService.insertData("result", bodyResult)
            .subscribe();
    }

    setBaseTestData(testId: number, studentId: number, maxUserRate: number) {
        this.testId = testId;
        this.studentId = studentId;
        this.maxUserRate = maxUserRate;
    }

    private getTestRecord = Observable.create(observer => {
        this.http
            .get(`${this.getTestRecordUrl}/${this.testId}`)
            .map(this.successResponse)
            .catch(this.handleError)
            .subscribe(testRecord => {
                this.timeForTest = +testRecord[0].time_for_test * 60;
                this.tasksCount = +testRecord[0].tasks;
                this.timer = this.createTimeForView(this.timeForTest);
                observer.next(testRecord);
            });
    });

    countTestPassesByStudent = (testRecord: any): Observable<any> => {
        return Observable.create(observer => {
            this.http
                .get(`${this.countTestPassesByStudentUrl}/${this.studentId}/${this.testId}`)
                .map(this.successResponse)
                .catch(this.handleError)
                .subscribe(countTestPassed => {
                    if (+countTestPassed.numberOfRecords >= +testRecord[0].attempts) {
                        this.openModalInfo("Ви використали всі спроби", "info", "Повідомлення.")
                            .then(null, () => {
                                this.router.navigate(["/student/profile"]);
                            });
                        return;
                    }
                    observer.next();
                });
        });

    };

    getTestDetails = () => {
        return Observable.create(observer => {
            this.subjectService.getTestDetailsByTest(this.testId)
                .subscribe((testDetails: TestDetail[]) => {
                    testDetails.forEach((data: TestDetail) => {
                        this.maxUserRate += +data.tasks * +data.rate;
                    });
                    observer.next(testDetails);
                });
        });
    };

    getQuestions = (testDetails: any) => {
        let questionCount: number = 0;
        this.questions = [];
        return Observable.create(observer => {
            testDetails.forEach(item => {
                this.subjectService.getQuestionsByLevelRand(item.test_id, item.level, item.tasks)
                    .subscribe((response: TestPlayerQuestions[]) => {
                        questionCount += +item.tasks;
                        response.forEach((question: TestPlayerQuestions) => {
                            question.chosenAnswer = {};
                            question.rate = item.rate + "";
                            question.type = question.type === "1" ? "radio" : "checkbox";
                            this.questions.push(question);
                        });
                        if (questionCount === this.tasksCount) {
                            this.questions.sort((a, b) => {
                                return this.randomSortOfObjects(a, b, "question_id");
                            });
                            this.navButtons = this.createNavButtons(this.questions.length);
                            observer.next(this.questions);
                        }
                    });
            });
        });
    };

    getAnswers = (questions) => {
        return Observable.create(observer => {
            let j: number = 0;
            questions.forEach((question) => {
                this.getAnswersByQuestion(question.question_id)
                    .subscribe((answers: TestPlayerAnswers[]) => {
                        answers.sort((a, b) => {
                            return this.randomSortOfObjects(a, b, "answer_id");
                        });
                        j++;
                        question.answers = answers;
                        if (j === this.questions.length) {
                            observer.next();
                        }
                    });
            });
        });
    };

    createTimeStamp = () => {
        return Observable.create(observer => {
            this.getTimeStamp()
                .subscribe(timeStamp => {
                    timeStamp.curtime = +timeStamp.unix_timestamp + this.timeForTest;
                    this.saveEndTime(timeStamp);
                    observer.next();
                });
        });
    };

    returnTestData = () => {
        return Observable.create(observer => {
            let testData: any = {
                navButtons: this.navButtons,
                questions: this.questions,
                tasksCount: this.tasksCount,
                timeForTest: this.timeForTest,
                maxUserRate: this.maxUserRate,
                timer: this.timer
            };
            observer.next(testData);
        });
    };

    getNewTest() {
        return this.getTestRecord
            .flatMap(this.countTestPassesByStudent)
            .flatMap(this.getTestDetails)
            .flatMap(this.getQuestions)
            .flatMap(this.getAnswers)
            .flatMap(this.createTimeStamp)
            .flatMap(this.returnTestData);
    }

    recoverTestData(questions: TestPlayerQuestions[]): Observable<TestPlayerQuestions[]> {
        return Observable.create(observer => {
            let counterQuestion: number = 0;
            let counterAnswers: number = 0;
            questions.forEach(question => {
                Observable.forkJoin(
                    this.crudService.getRecordById("question", question.question_id),
                    this.getAnswersByQuestion(question.question_id)
                ).subscribe(data => {
                    question.question_text = data[0][0].question_text;
                    question.attachment = data[0][0].attachment;
                    question.answers.forEach(answer => {
                        data[1].forEach(elem => {
                            if (answer.answer_id === elem.answer_id) {
                                counterAnswers++;
                                answer.answer_text = elem.answer_text;
                                answer.attachment = elem.attachment;
                                if (counterAnswers === question.answers.length) {
                                    counterQuestion++;
                                    counterAnswers = 0;
                                }
                                if (counterQuestion === this.questions.length) {
                                    observer.next(questions);
                                }
                            }
                        });
                    });
                });
            });
        });
    }

    randomSortOfObjects(a: Object, b: Object, property: string): any {
        return Math.random() > 0.5 ? +a[property] - +b[property] : +b[property] - +a[property];
    }

    openModalInfo(infoString: string, type: string, title: string): Promise < any > {
        let config: ConfigModalInfo = new ConfigModalInfo(infoString, type, title);
        let modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRef.componentInstance.config = config;
        return modalRef.result;
    }

    getTimeStamp(): Observable < any > {
        return this.http
            .get(`${this.getTimeStampUrl}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    saveEndTime(body: any) {
        this.http
            .post(this.saveEndTimeUrl, JSON.stringify(body), {headers: this.headersCheckSAnswer})
            .map(this.successResponse)
            .catch(this.handleError)
            .subscribe();
    }

    getEndTime(): Observable < any > {
        return this.http
            .get(`${this.getEndTimeUrl}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    resetSessionData() {
        this.http
            .get(`${this.resetSessionDataUrl}`)
            .map(this.successResponse)
            .catch(this.handleError)
            .subscribe();
    }

    createNavButtons(countOfButtons: number): TestPlayerNavButton[] {
        let navButtons: TestPlayerNavButton[] = [
            {answered: false, label: "01", active: true, className: `${navButtonConstClassName} btn-warning`}];
        for (let i = 1; i < countOfButtons; i++) {
            navButtons.push(new TestPlayerNavButton());
            navButtons[i].label = this.leftPad(i + 1);
            navButtons[i].className = `${navButtonConstClassName} btn-primary`;
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
        let bodyCheck: any[] = [];
        questions.forEach(question => {
            let data: any = {};
            data.question_id = question.question_id;
            data.answer_ids = [];
            for (let key in question.chosenAnswer) {
                if (question.chosenAnswer[key]) {
                    data.answer_ids.push(key);
                }
            }
            bodyCheck.push(data);
        });
        return bodyCheck;
    }
    ;

    createTimeForView(restOfTime: number) {
        let hours: number = restOfTime / 3600 ^ 0;
        let min: number = (restOfTime - hours * 60) / 60 ^ 0;
        let sec: number = (restOfTime - hours * 3600 - min * 60);
        return {
            hours: this.leftPad(hours),
            min: this.leftPad(min),
            sec: this.leftPad(sec)
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
        bodyResult.true_answers = "";
        bodyResult.answers = bodyResultParams.maxUserRate;
        bodyResult.student_id = bodyResultParams.studentId;
        bodyResult.test_id = bodyResultParams.testId;
        let date = new Date(bodyResultParams.startTime * 1000);
        let dateEnd = new Date(bodyResultParams.endTime * 1000);
        bodyResult.session_date = `${this.leftPad(date.getFullYear())}-${this.leftPad(date.getMonth() + 1)}-${this.leftPad(date.getDate())}`;
        bodyResult.start_time = `${this.leftPad(date.getHours())}:${this.leftPad(date.getMinutes())}:${this.leftPad(date.getSeconds())}`;
        bodyResult.end_time = `${this.leftPad(dateEnd.getHours())}:${this.leftPad(dateEnd.getMinutes())}:${this.leftPad(dateEnd.getSeconds())}`;
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

    leftPad(num: number): string {
        let result: string;
        if (num >= 0) {
            result = num < 10 ? `0${num}` : `${num}`;
        } else {
            result = Math.abs(num) < 10 ? `-0${Math.abs(num)}` : `${num}`;
        }
        return result;
    }
}