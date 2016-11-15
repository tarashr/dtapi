import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SubjectService} from "../shared/services/subject.service";
import {TestPlayerService} from "../shared/services/test-player.service";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {ConfigModalInfo} from "../shared/classes/configs/config-modal-info";
import {navButtonConstClassName} from "../shared/constant";
import {TestPlayerQuestions} from "../shared/classes/test-player-questions";
import {TestPlayerNavButton} from "../shared/classes/test-player-nav-buttons";
import {TestDetail} from "../shared/classes/test-detail";
import {TestPlayerAnswers} from "../shared/classes/test-player-answers";
import {TestPlayerDtapiResult} from "../shared/classes/test-player-dtapi-result";
import {Subscription} from "rxjs";
import {CRUDService} from "../shared/services/crud.service";

@Component({
    templateUrl: "test-player.component.html",
    styleUrls: ["test-player.component.css"]
})

export class TestPlayerComponent implements OnInit, OnDestroy {

    private testId: number;
    private studentId: number;

    private subscription: Subscription;

    private navButtons: TestPlayerNavButton[];
    private navButtonConstClassName: string = navButtonConstClassName;
    private activeQuestion: number = 0;
    private questions: TestPlayerQuestions[] = [];
    private tasksCount: number = 0;
    private questionCount: number = 0;
    private unAnsweredQuestionCount: number = 0;
    private unAnsweredQuestionPercent: number = 100;
    private leftTimePercent: number = 100;
    private timeForTest: number;
    private restOfTime: number;
    private timer: any = {};
    private timerId: any;
    private precisionTime: number = 5;
    private show: boolean = false;
    private testDetails: TestDetail[];
    private maxUserRate: number = 0;
    private informedUserAboutAllQuestionAnswered: boolean = false;

    constructor(private subjectService: SubjectService,
                private testPlayerService: TestPlayerService,
                private crudService: CRUDService,
                private modalService: NgbModal,
                private location: Location,
                private router: Router,
                private route: ActivatedRoute) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.testId = +data["testId"];
            });
    }

    ngOnInit() {
        this.studentId = +sessionStorage.getItem("userId");
        this.getNewTest();
    };

    startTimer() {
        this.restOfTime--;
        this.leftTimePercent = Math.round(this.restOfTime / this.timeForTest * 100);
        if (this.restOfTime < 0) {
            this.leftTimePercent = 0;
            this.checkTimer();
            return;
        }
        this.createTimeForView();
    }

    createTimeForView() {
        this.timer.hours = this.restOfTime / 3600 ^ 0;
        this.timer.min = (this.restOfTime - this.timer.hours * 60) / 60 ^ 0;
        this.timer.sec = (this.restOfTime - this.timer.hours * 3600 - this.timer.min * 60);
        this.timer.hours < 10 ? this.timer.hours = `0${this.timer.hours}` : null;
        this.timer.min < 10 ? this.timer.min = `0${this.timer.min}` : null;
        this.timer.sec < 10 ? this.timer.sec = `0${this.timer.sec}` : null;
    }

    skipQuestion(numberOfQuestion: number) {
        if (numberOfQuestion === this.questions.length) {
            for (let i = 0; i < this.navButtons.length; i++) {
                if (!this.navButtons[i].answered) {
                    this.changeActiveQuestion(i);
                    break;
                } else {
                    this.changeActiveQuestion(0);
                }
            }
        } else this.changeActiveQuestion(this.activeQuestion + 1);
    }
    ;

    answerQuestion() {
        if (!this.navButtons[this.activeQuestion].answered) {
            this.navButtons[this.activeQuestion].answered = true;
            this.unAnsweredQuestionCount--;
            this.unAnsweredQuestionPercent = Math.round(this.unAnsweredQuestionCount / this.tasksCount * 100);
        }
        let allAnswered = this.navButtons.every((question) => {
            return question.answered;
        });
        if (allAnswered && !this.informedUserAboutAllQuestionAnswered) {
            this.informedUserAboutAllQuestionAnswered = true;
            this.openModalInfo(`Ви відповіли на всі запитання. 
            Щоб закінчити тестування натисніть кнопку "Завершити тест"`, "info", "Повідомлення.");
        } else if (allAnswered) {
            this.activeQuestion === this.questions.length - 1 ?
                this.changeActiveQuestion(0) :
                this.changeActiveQuestion(this.activeQuestion + 1);
        } else {
            if (this.activeQuestion === this.questions.length - 1) {
                for (let i = 0; i < this.navButtons.length; i++) {
                    if (!this.navButtons[i].answered) {
                        this.changeActiveQuestion(i);
                        return;
                    }
                }
            } else {
                this.changeActiveQuestion(this.activeQuestion + 1);
            }
        }
    }

    changeActiveQuestion(num: number) {
        if (num === this.activeQuestion) return;
        this.navButtons[this.activeQuestion].answered ?
            this.navButtons[this.activeQuestion].className = `${navButtonConstClassName} btn-success` :
            this.navButtons[this.activeQuestion].className = `${navButtonConstClassName} btn-primary`;
        this.activeQuestion = num;
        this.navButtons[this.activeQuestion].className = `${navButtonConstClassName} btn-warning`;
    }

    toggleAnswer(event: any, answerId: number, numberOfQuestion: number) {
        let question = this.questions[numberOfQuestion];
        let chosenAnswer = this.questions[numberOfQuestion].chosenAnswer[answerId];
        if (question.type === "checkbox") {
            question.chosenAnswer[answerId] = !chosenAnswer;
        }
        else {
            if (!chosenAnswer) {
                for (let key in question.chosenAnswer) {
                    question.chosenAnswer[key] = false;
                }
                question.chosenAnswer[answerId] = true;
            }
        }
        event.stopImmediatePropagation();
    }

    finishTest() {
        this.openModalInfo("Ви дійсно хочете завершити тестування?", "confirm", "Підтвердження.")
            .then(() => this.checkTimer(), null);
    }

    checkTimer() {
        clearInterval(this.timerId);
        this.testPlayerService.getTimeStamp()
            .subscribe(timeEndOfTest => {
                this.testPlayerService.getEndTime().subscribe(savedEndOfTest => {
                    let startTime = +savedEndOfTest.unix_timestamp;
                    let endTime = +timeEndOfTest.unix_timestamp;
                    if (+savedEndOfTest.curtime + this.precisionTime > endTime) {
                        this.checkAnswers(startTime, endTime);
                    } else {
                        this.failTestByTimer(startTime, endTime);
                    }
                });
            });
    }

    failTestByTimer(startTime: number, endTime: number) {
        let userRate: number = 0;
        this.questions.forEach(question => {
            question.chosenAnswer = {};
        });
        this.saveResults(userRate, startTime, endTime, []);
        this.testPlayerService.resetSessionData();
        this.openModalInfo(`Тест закінчено поза межами відведеного часу.  
        Ваша оцінка становить 0 балів.`, "info", "Результат тестування!")
            .then(null, () => {
                this.location.back();
            });
    }

    checkAnswers(startTime: number, endTime: number) {
        this.testPlayerService.checkSAnswers(this.questions)
            .subscribe((results: TestPlayerDtapiResult[]) => {
                let userRate = this.testPlayerService.getUserRate(results, this.questions);
                this.testPlayerService.resetSessionData();
                this.saveResults(userRate, startTime, endTime, results);
                this.openModalInfo(`Кількість набраних Вами балів становить: ${userRate} з ${this.maxUserRate} 
                максимально можливих`, "info", "Результат тестування!")
                    .then(null, () => {
                        this.location.back();
                    });
            });
    }

    openModalInfo(infoString: string, type: string, title: string): Promise<any> {
        let config: ConfigModalInfo = new ConfigModalInfo(infoString, type, title);
        let modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRef.componentInstance.config = config;
        return modalRef.result;
    }

    saveResults(userRate: number, startTime: number, endTime: number, results: any[]) {
        let bodyResult: any = this.testPlayerService.createBodyResult(this.studentId,
            this.testId,
            startTime,
            endTime,
            userRate,
            results,
            this.questions);
        this.crudService.insertData("result", bodyResult)
            .subscribe();
    }

    getNewTest() {
        this.testPlayerService.getTestRecord(this.testId)
            .subscribe(testRecord => {
                this.timeForTest = +testRecord[0].time_for_test * 60;
                this.restOfTime = this.timeForTest;
                this.tasksCount = +testRecord[0].tasks;
                this.createTimeForView();
                this.testPlayerService.countTestPassesByStudent(this.studentId, this.testId)
                    .subscribe(countTestPassed => {
                        if (+countTestPassed.numberOfRecords >= +testRecord[0].attempts) {
                            this.openModalInfo("Ви використали всі спроби", "info", "Повідомлення.")
                                .then(null, () => {
                                    this.router.navigate(["/student/profile"]);
                                });
                            return;
                        }
                        this.subjectService.getTestDetailsByTest(this.testId)
                            .subscribe((testDetails: TestDetail[]) => {
                                this.testDetails = testDetails;
                                testDetails.forEach((data: TestDetail) => {
                                    this.maxUserRate += +data.tasks * +data.rate;
                                });
                                this.unAnsweredQuestionCount = this.tasksCount;
                                testDetails.forEach((item: TestDetail) => {
                                    this.subjectService.getQuestionsByLevelRand(item.test_id, item.level, item.tasks)
                                        .subscribe((response: TestPlayerQuestions[]) => {
                                            this.questionCount += +item.tasks;
                                            response.forEach((question: TestPlayerQuestions) => {
                                                question.chosenAnswer = {};
                                                question.rate = item.rate + "";
                                                question.type === "1" ? question.type = "radio" : question.type = "checkbox";
                                                this.questions.push(question);
                                            });
                                            if (this.questionCount === this.tasksCount) {
                                                this.questions.sort((a, b) => {
                                                    return Math.random() > 0.5 ? +a.question_id - +b.question_id : +b.question_id - +a.question_id;
                                                });
                                                this.navButtons = this.testPlayerService.createButtons(this.questions.length);
                                                this.questions.forEach((elem, j) => {
                                                    this.testPlayerService.getAnswersByQuestion(elem.question_id)
                                                        .subscribe((answers: TestPlayerAnswers[]) => {
                                                            answers.sort((a, b) => {
                                                                return Math.random() > 0.5 ? +a.answer_id - +b.answer_id : +b.answer_id - +a.answer_id;
                                                            });
                                                            elem.answers = answers;
                                                            if (j === this.questions.length - 1) {
                                                                this.testPlayerService.getTimeStamp()
                                                                    .subscribe(timeStamp => {
                                                                        timeStamp.curtime = +timeStamp.unix_timestamp + this.timeForTest;
                                                                        this.show = true;
                                                                        this.testPlayerService.saveEndTime(timeStamp);
                                                                        this.timerId = setInterval(() => {
                                                                            this.startTimer();
                                                                        }, 1000);
                                                                    });

                                                            }
                                                        });
                                                });
                                            }
                                        });
                                });
                            });
                    });

            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}