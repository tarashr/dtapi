import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {TestPlayerService} from "../shared/services/test-player.service";
import {TestPlayerQuestions, TestPlayerNavButton} from "../shared/classes";
import {CommonService} from "../shared/services/common.service";
import {ComponentCanDeactivate} from "../shared/services/test-player.guard";
import {Observable} from "rxjs";
import {modalInfoParams} from "../shared/constant";

@Component({
    templateUrl: "test-player.component.html",
    styleUrls: ["test-player.component.css"]
})

export class TestPlayerComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

    private testId: number;
    private studentId: number;
    private navButtons: TestPlayerNavButton[];
    private activeQuestion: number = 0;
    private questions: TestPlayerQuestions[] = [];
    private tasksCount: number = 0;
    private unAnsweredQuestionCount: number = 0;
    private unAnsweredQuestionPercent: number = 100;
    private leftTimePercent: number = 100;
    private timeForTest: number;
    private restOfTime: number;
    private timer: any = {};
    private timerId: any;
    private show: boolean = false;
    private disableSkip: boolean = false;
    private maxUserRate: number = 0;
    private informedUserAboutAllQuestionAnswered: boolean = false;
    private finishedTest: boolean = true;
    private modalParams: any = modalInfoParams;

    constructor(private testPlayerService: TestPlayerService,
                private route: ActivatedRoute,
                private router: Router,
                private commonService: CommonService) {
    }

    ngOnInit() {
        this.route.queryParams.forEach(
            data => {
                this.testId = +data["testId"];
            });
        this.studentId = +sessionStorage.getItem("userId");
        if (localStorage.getItem("dTester")) {
            this.continueTest();
        } else {
            this.testPlayerService.setBaseTestData(this.testId, this.studentId, this.maxUserRate);
            this.getNewTest();
        }
    };

    canDeactivate(): Observable<boolean> {
        return Observable.create(observer => {
            if (!this.finishedTest) {
                this.commonService.openModalInfo(...this.modalParams.canDeactivateMessage)
                    .then(() => {
                        observer.next(true);
                    }, () => {
                        observer.next(false);
                    });
            }
            else {
                observer.next(true);
            }
        });
    }

    startTimer() {
        this.restOfTime--;
        if (this.restOfTime === 0) {
            this.finishedTest = true;
            this.leftTimePercent = 0;
            this.timer = this.testPlayerService.createTimeForView(this.restOfTime);
            clearInterval(this.timerId);
            this.checkTimer(false);
            return;
        } else {
            this.leftTimePercent = Math.round(this.restOfTime / this.timeForTest * 100);
        }
        this.timer = this.testPlayerService.createTimeForView(this.restOfTime);
    }

    skipQuestion() {
        const activeQuestion = this.testPlayerService.findUnAsweredQuestion(this.activeQuestion, this.navButtons);
        this.changeActiveQuestion(activeQuestion);
    }

    answerQuestion() {
        this.createQuestionsProgressbarData();
        this.questions[this.activeQuestion].answered = true;
        const allAnswered = this.allAnswered();
        if (!allAnswered) {
            const activeQuestion = this.testPlayerService.findUnAsweredQuestion(this.activeQuestion, this.navButtons);
            this.changeActiveQuestion(activeQuestion);
        } else if (!this.informedUserAboutAllQuestionAnswered) {
            this.disableSkip = true;
            this.informedUserAboutAllQuestionAnswered = true;
            this.testPlayerService.createBackup(this.questions);
            this.commonService.openModalInfo(...this.modalParams.youAsweredAllQuestion);
        } else {
            const activeQuestion = this.testPlayerService.findUnAsweredQuestion(this.activeQuestion, this.navButtons);
            this.changeActiveQuestion(activeQuestion);
        }
    }

    allAnswered(): boolean {
        return this.navButtons.every((question) => {
            return question.answered;
        });
    }

    createQuestionsProgressbarData() {
        if (!this.navButtons[this.activeQuestion].answered) {
            this.navButtons[this.activeQuestion].answered = true;
            this.unAnsweredQuestionCount--;
            this.unAnsweredQuestionPercent = Math.round(this.unAnsweredQuestionCount / this.tasksCount * 100);
        }
    }

    changeActiveQuestion(num: number) {
        if (num === this.activeQuestion) return;
        this.questions[this.activeQuestion].active = false;
        this.activeQuestion = this.testPlayerService.changeNavButtons(num, this.navButtons, this.activeQuestion);
        this.questions[this.activeQuestion].active = true;
        this.testPlayerService.createBackup(this.questions);
    }

    toggleAnswer(answerId: number, numberOfQuestion: number) {
        let question = this.questions[numberOfQuestion];
        let chosenAnswer = this.questions[numberOfQuestion].chosenAnswer[answerId];
        if (question.type === "checkbox") {
            question.chosenAnswer[answerId] = !chosenAnswer;
        }
        else if (!chosenAnswer) {
            for (let key in question.chosenAnswer) {
                question.chosenAnswer[key] = false;
            }
            question.chosenAnswer[answerId] = true;
        }
    }

    finishTest() {
        this.commonService.openModalInfo(...this.modalParams.doYouWantFinishTest)
            .then(() => {
                this.finishedTest = true;
                this.checkTimer(false);
            }, this.testPlayerService.handleReject);
    }

    finishCheckTimer = (data: any, continueTest: boolean) => {
        if (!data.checkResult) {
            this.testPlayerService.failTestByTimer(this.questions, data.startTime, data.endTime);
        } else if (continueTest) {
            this.restOfTime = data.restOfTime;
            this.timer = this.testPlayerService.createTimeForView(this.restOfTime);
            this.timerId = setInterval(() => {
                this.startTimer();
            }, 1000);
            this.finishedTest = false;
            this.show = true;
        } else {
            this.testPlayerService.checkSAnswers(this.questions, data.startTime, data.endTime);
        }
    }

    checkTimer(continueTest: boolean) {
        this.testPlayerService.checkTimer()
            .subscribe((data: any) => {
                this.finishCheckTimer(data, continueTest);
            });
    }

    getNewTest() {
        this.testPlayerService.getNewTest()
            .subscribe((testData) => {
                    this.questions = testData.questions;
                    this.navButtons = testData.navButtons;
                    this.timeForTest = this.restOfTime = testData.timeForTest;
                    this.tasksCount = this.unAnsweredQuestionCount = testData.tasksCount;
                    this.maxUserRate = testData.maxUserRate;
                    this.timer = testData.timer;
                    this.show = true;
                    this.timerId = setInterval(() => {
                        this.startTimer();
                    }, 1000);
                    this.finishedTest = false;
                    this.testPlayerService.createBackup(this.questions);
                },
                this.getNewTestError);
    }

    getNewTestError = (error) => {
        let message: string;
        let mistake = error.message ? error.message : error;
        switch (mistake) {
            case "test does not exist":
                message = "Ви намагаєтесь зайти на неіснуючий тест. Виберіть доступний Вам тест на сторіці Вашого профайлу.";
                break;
            case "test data are absent":
                message = "Відсутні дані для тесту";
                break;
            case "attempts ended":
                message = "Ви використали всі спроби";
                this.testPlayerService.resetSessionData();
                break;
            default:
                message = "Невідома помилка!";
        }
        this.commonService.openModalInfo(message)
            .then(this.testPlayerService.handleReject,
                () => {
                    this.router.navigate(["/student"]);
                });
    }

    continueTest() {
        this.testPlayerService.recoverTestData()
            .subscribe((testData) => {
                this.questions = testData.questions;
                this.navButtons = testData.navButtons;
                this.timeForTest = this.restOfTime = testData.timeForTest;
                this.tasksCount = this.unAnsweredQuestionCount = testData.tasksCount;
                this.maxUserRate = testData.maxUserRate;
                this.timer = testData.timer;
                this.navButtons.forEach((button, i) => {
                    if (button.active) {
                        this.activeQuestion = i;
                    }
                    if (button.answered) {
                        this.unAnsweredQuestionCount--;
                    }
                });
                this.unAnsweredQuestionPercent = Math.round(this.unAnsweredQuestionCount / this.tasksCount * 100);
                this.checkTimer(true);
            });
    }

    ngOnDestroy() {
        clearInterval(this.timerId);
    }
}