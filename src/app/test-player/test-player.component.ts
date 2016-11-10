import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SubjectService} from "../shared/services/subject.service";
import {TestPlayerService} from "../shared/services/test-player.service";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {modalInfoConfig} from "../shared/constant";

@Component({
    templateUrl: "test-player.component.html",
    styleUrls: ["test-player.component.css"]
})

export class TestPlayerComponent implements OnInit {

    private modalInfoConfig = modalInfoConfig;
    private testId: number = 13;

    private navButtons: any[];

    private activeQuestion: number = 0;
    private questions: any[] = [];
    private tasksCount: number = 0;
    private questionCount: number = 0;
    private show: boolean = false;
    private testDetails: any[];
    private maxUserRate: number = 0;

    constructor(private router: Router,
                private subjectService: SubjectService,
                private testPlayerService: TestPlayerService,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.subjectService.getTestDetailsByTest(this.testId)
            .subscribe(testDetails => {
                this.testDetails = testDetails;
                testDetails.forEach((data) => {
                    this.tasksCount += +data.tasks;
                    this.maxUserRate += +data.tasks * +data.rate;
                });
                testDetails.forEach((item) => {
                    this.subjectService.getQuestionsByLevelRand(item.test_id, item.level, item.tasks)
                        .subscribe(response => {
                            this.questionCount += +item.tasks;
                            response.forEach(question => {
                                question.chosenAnswer = {};
                                question.rate = item.rate;
                                this.questions.push(question);
                            });
                            if (this.questionCount === this.tasksCount) {
                                this.questions.sort((a, b) => {
                                    return Math.random() > 0.5 ? +a.question_id - +b.question_id : +b.question_id - +a.question_id;
                                });
                                this.navButtons = this.testPlayerService.createButtons(this.questions.length);
                                this.questions.forEach((elem, j) => {
                                    this.testPlayerService.getAnswersByQuestion(elem.question_id)
                                        .subscribe(answers => {
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
                if (this.navButtons[i].answered === false) {
                    this.changeActiveQuestion(i);
                    break;
                }
            }
        }
        else this.changeActiveQuestion(this.activeQuestion + 1);
    };

    answerQuestion() {
        this.navButtons[this.activeQuestion].answered = true;
        let finishTest = this.navButtons.some((question) => {
            return question.answered === false;
        });
        if (!finishTest) {
            this.testPlayerService.checkSAnswers(this.questions)
                .subscribe(results => {
                    let userRate = this.testPlayerService.getUserRate(results, this.questions);
                    this.modalInfoConfig.title = "Результат тестування!";
                    this.modalInfoConfig.action = "info";
                    this.modalInfoConfig.infoString = `Кількість набраних Вами балів становить: ${userRate} з ${this.maxUserRate} максимально можливих`;
                    let modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
                    modalRef.componentInstance.config = this.modalInfoConfig;
                });
        }

        else {
            if (this.activeQuestion === this.questions.length - 1) {
                for (let i = 0; i < this.navButtons.length; i++) {
                    if (this.navButtons[i].answered === false) {
                        this.changeActiveQuestion(i);
                        break;
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
            this.navButtons[this.activeQuestion].className = "btn btn-success nom-qua" :
            this.navButtons[this.activeQuestion].className = "btn btn-primary nom-qua";
        this.activeQuestion = num;
        this.navButtons[this.activeQuestion].className = "btn btn-warning nom-qua";
    }

    toggleAnswer(event: any, answerId: number, numberOfQuestion: number) {
        this.questions[numberOfQuestion].chosenAnswer[answerId] = !this.questions[numberOfQuestion].chosenAnswer[answerId];
        event.stopImmediatePropagation();


    }

}