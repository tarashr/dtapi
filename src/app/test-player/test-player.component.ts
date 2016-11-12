import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
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

@Component({
    templateUrl: "test-player.component.html",
    styleUrls: ["test-player.component.css"]
})

export class TestPlayerComponent implements OnInit {

    private testId: number = 3;

    private navButtons: TestPlayerNavButton[];
    private navButtonConstClassName: string = navButtonConstClassName;
    private activeQuestion: number = 0;
    private questions: TestPlayerQuestions[] = [];
    private tasksCount: number = 0;
    private questionCount: number = 0;
    private show: boolean = false;
    private testDetails: TestDetail[];
    private maxUserRate: number = 0;
    private informedUserAboutAllQuestionAnswered: boolean = false;

    constructor(private subjectService: SubjectService,
                private testPlayerService: TestPlayerService,
                private modalService: NgbModal,
                private location: Location) {
    }

    ngOnInit() {
        this.subjectService.getTestDetailsByTest(this.testId)
            .subscribe((testDetails: TestDetail[]) => {
                this.testDetails = testDetails;
                testDetails.forEach((data: TestDetail) => {
                    this.tasksCount += +data.tasks;
                    this.maxUserRate += +data.tasks * +data.rate;
                });
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
                                                this.show = true;
                                            }
                                        });
                                });
                            }
                        });
                });
            });
    };

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
    };

    answerQuestion() {
        this.navButtons[this.activeQuestion].answered = true;
        let allAnswered = this.navButtons.every((question) => {
            return question.answered;
        });
        if (allAnswered && !this.informedUserAboutAllQuestionAnswered) {
            this.informedUserAboutAllQuestionAnswered = true;
            let configAskForFinishTest: ConfigModalInfo = new ConfigModalInfo(`Ви відповіли на всі запитання. Щоб закінчити тестування натисніть кнопку "Завершити тест"`);
            let askForFinishModalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
            askForFinishModalRef.componentInstance.config = configAskForFinishTest;
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
    };

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
        let confirmFinishTestModal: ConfigModalInfo = new ConfigModalInfo("Ви дійсно хочете завершити тестування?",
            "confirm",
            "Підтвердження.");
        let confirmFinishTestModalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
        confirmFinishTestModalRef.componentInstance.config = confirmFinishTestModal;
        confirmFinishTestModalRef.result
            .then(() => {
                this.testPlayerService.checkSAnswers(this.questions)
                    .subscribe((results: TestPlayerDtapiResult[]) => {
                        let userRate = this.testPlayerService.getUserRate(results, this.questions);
                        let infoUserRateModal: ConfigModalInfo = new ConfigModalInfo(`Кількість набраних Вами балів становить: ${userRate} з ${this.maxUserRate} максимально можливих`,
                            "info",
                            "Результат тестування!");
                        let infoAboutUserRateModalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
                        infoAboutUserRateModalRef.componentInstance.config = infoUserRateModal;
                        infoAboutUserRateModalRef.result
                            .then(null, () => {
                                this.location.back();
                            });
                    });
            }, null);

    }

}