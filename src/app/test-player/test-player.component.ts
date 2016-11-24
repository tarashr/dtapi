import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {TestPlayerService} from "../shared/services/test-player.service";
import {TestPlayerQuestions} from "../shared/classes/test-player-questions";
import {TestPlayerNavButton} from "../shared/classes/test-player-nav-buttons";
import {Observable} from "rxjs";

@Component({
    templateUrl: "test-player.component.html",
    styleUrls: ["test-player.component.css"]
})

export class TestPlayerComponent implements OnInit, OnDestroy {

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
    private precisionTime: number = 5;
    private show: boolean = false;
    private disableSkip: boolean = false;
    private maxUserRate: number = 0;
    private informedUserAboutAllQuestionAnswered: boolean = false;

    constructor(private testPlayerService: TestPlayerService,
                private route: ActivatedRoute) {
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

    startTimer() {
        this.restOfTime--;
        if (this.restOfTime <= 0) {
            this.leftTimePercent = 0;
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
        if (allAnswered && !this.informedUserAboutAllQuestionAnswered) {
            this.disableSkip = true;
            this.informedUserAboutAllQuestionAnswered = true;
            localStorage.setItem("dTester", JSON.stringify(this.createBackup()));
            this.testPlayerService.openModalInfo(`Ви відповіли на всі запитання. 
            Щоб закінчити тестування натисніть кнопку "Завершити тест"`, "info", "Повідомлення.");
        } else if (allAnswered) {
            this.activeQuestion === this.questions.length - 1 ?
                this.changeActiveQuestion(0) :
                this.changeActiveQuestion(this.activeQuestion + 1);
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

    createBackup() {
        let dTester: any = {};
        dTester.navButtons = this.navButtons;
        dTester.maxUserRate = this.maxUserRate;
        dTester.timeForTest = this.timeForTest;
        let questionsJSON: string = JSON.stringify(this.questions);
        dTester.questions = JSON.parse(questionsJSON);
        dTester.questions.forEach(question => {
            delete question.question_text;
            delete question.attachment;
            question.answers.forEach(answer => {
                delete answer.answer_text;
                delete answer.attachment;
            });
        });
        return dTester;
    }

    changeActiveQuestion(num: number) {
        if (num === this.activeQuestion) return;
        this.questions[this.activeQuestion].active = false;
        this.activeQuestion = this.testPlayerService.changeNavButtons(num, this.navButtons, this.activeQuestion);
        this.questions[this.activeQuestion].active = true;
        localStorage.setItem("dTester", JSON.stringify(this.createBackup()));
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
        this.testPlayerService.openModalInfo("Ви дійсно хочете завершити тестування?", "confirm", "Підтвердження.")
            .then(() => this.checkTimer(false), null);
    }

    private getTime = Observable.create(observer => {
        this.testPlayerService.getTimeStamp()
            .subscribe(timeEndOfTest => {
                observer.next(timeEndOfTest);
            });
    });

    getSavedTime = (timeEndOfTest) => {
        return Observable.create(observer => {
            this.testPlayerService.getEndTime()
                .subscribe(savedEndOfTest => {
                    observer.next({timeEndOfTest, savedEndOfTest});
                });
        });
    }

    compareTime = (times) => {
        return Observable.create(observer => {
            let startTime = +times.savedEndOfTest.unix_timestamp;
            let endTime = +times.timeEndOfTest.unix_timestamp;
            if (+times.savedEndOfTest.curtime + this.precisionTime > endTime) {
                // this.testPlayerService.checkSAnswers(this.questions, startTime, endTime);
                this.restOfTime = +times.savedEndOfTest.curtime - +times.timeEndOfTest.unix_timestamp;
                observer.next({checkResult: true, startTime, endTime});
            } else {
                // this.testPlayerService.failTestByTimer(this.questions, startTime, endTime);
                observer.next({checkResult: false, startTime, endTime});
            }
        });
    }

    // compareTimeContinuedTest = (times) => {
    //     let startTime = +times.savedEndOfTest.unix_timestamp;
    //     let endTime = +times.timeEndOfTest.unix_timestamp;
    //     if (+times.savedEndOfTest.curtime + this.precisionTime > endTime) {
    //         this.restOfTime = +times.savedEndOfTest.curtime - +times.timeEndOfTest.unix_timestamp;
    //         this.timer = this.testPlayerService.createTimeForView(this.restOfTime);
    //         this.timerId = setInterval(() => {
    //             this.startTimer();
    //         }, 1000);
    //     } else {
    //         this.testPlayerService.failTestByTimer(this.questions, startTime, endTime);
    //     }
    // }

    finishCheckTimer = (data: any, continueTest: boolean) => {
        if (!data.checkResult) {
            this.testPlayerService.failTestByTimer(this.questions, data.startTime, data.endTime);
        } else if (continueTest) {
            this.timer = this.testPlayerService.createTimeForView(this.restOfTime);
            this.timerId = setInterval(() => {
                this.startTimer();
            }, 1000);
        } else {
            this.testPlayerService.checkSAnswers(this.questions, data.startTime, data.endTime);
        }
    }

    checkTimer(continueTest: boolean) {
        this.getTime
            .flatMap(this.getSavedTime)
            .flatMap(this.compareTime)
            .subscribe((data: any) => {
                this.finishCheckTimer(data, continueTest);
            });
    }

    // checkTimer(continueTest: boolean) {
    //     clearInterval(this.timerId);
    //     this.testPlayerService.getTimeStamp()
    //         .subscribe(timeEndOfTest => {
    //             this.testPlayerService.getEndTime()
    //                 .subscribe(savedEndOfTest => {
    //                     let startTime = +savedEndOfTest.unix_timestamp;
    //                     let endTime = +timeEndOfTest.unix_timestamp;
    //                     if (+savedEndOfTest.curtime + this.precisionTime > endTime) {
    //                         if (continueTest) {
    //                             this.restOfTime = +savedEndOfTest.curtime - +timeEndOfTest.unix_timestamp;
    //                             this.timer = this.testPlayerService.createTimeForView(this.restOfTime);
    //                             this.timerId = setInterval(() => {
    //                                 this.startTimer();
    //                             }, 1000);
    //                         } else {
    //                             this.testPlayerService.checkSAnswers(this.questions, startTime, endTime);
    //                         }
    //                     } else {
    //                         this.testPlayerService.failTestByTimer(this.questions, startTime, endTime);
    //                     }
    //                 });
    //         });
    // }

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
                localStorage.setItem("dTester", JSON.stringify(this.createBackup()));
            });
    }

    continueTest() {
        const dTester = JSON.parse(localStorage.getItem("dTester"));
        this.timeForTest = dTester.timeForTest;
        this.checkTimer(true);
        this.maxUserRate = dTester.maxUserRate;
        this.testPlayerService.setBaseTestData(this.testId, this.studentId, this.maxUserRate);
        this.questions = dTester.questions;
        this.tasksCount = this.questions.length;
        this.unAnsweredQuestionCount = this.tasksCount;
        this.navButtons = dTester.navButtons;
        this.navButtons.forEach((button, i) => {
            if (button.active) {
                this.activeQuestion = i;
            }
            if (button.answered) {
                this.unAnsweredQuestionCount--;
            }
        });
        this.unAnsweredQuestionPercent = Math.round(this.unAnsweredQuestionCount / this.tasksCount * 100);
        this.testPlayerService.recoverTestData(this.questions)
            .subscribe(questions => {
                this.questions = questions;
                this.show = true;
            });
    }

    ngOnDestroy() {
        clearInterval(this.timerId);
    }
}