import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {SubjectService} from "../shared/services/subject.service";
import {TestPlayerService} from "../shared/services/test-player.service";


@Component({
    templateUrl: "test-player.component.html",
    styleUrls: ["../studentpart/start-page.component.css", "test-player.component.css"]
})

export class TestPlayerComponent implements OnInit {

    private testId: number = 3;

    private navButtons: any[];

    private activeQuestion: number = 1;
    private questions: any[] = [];
    private tasksCount: number = 0;
    private questionCount: number = 0;
    private show: boolean = false;
    private testDetails: any[];

    constructor(private router: Router,
                private subjectService: SubjectService,
                private testPlayerService: TestPlayerService) {
    }

    ngOnInit() {
        this.subjectService.getTestDetailsByTest(this.testId)
            .subscribe(testDetails => {
                this.testDetails = testDetails;
                testDetails.forEach((data) => {
                    this.tasksCount += +data.tasks;
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
        numberOfQuestion > this.questions.length ?
            console.log("Питання закінчились") :
            this.changeActiveQuestion(this.activeQuestion + 1);
    };

    answerQuestion() {
        this.navButtons[this.activeQuestion - 1].answered = true;
        if (this.activeQuestion === this.questions.length) {
            this.testPlayerService.checkSAnswers(this.questions)
                .subscribe(results => {
                    let userRate = this.testPlayerService.getUserRate(results, this.questions);
                    alert("your rate is: " + userRate);
                });
        }
        else {
            this.changeActiveQuestion(this.activeQuestion + 1);
        }
    };

    changeActiveQuestion(num: number) {
        if (num === this.activeQuestion) return;
        this.navButtons[this.activeQuestion - 1].answered ?
            this.navButtons[this.activeQuestion - 1].className = "btn btn-success nom-qua" :
            this.navButtons[this.activeQuestion - 1].className = "btn btn-primary nom-qua";
        this.activeQuestion = num;
        this.navButtons[this.activeQuestion - 1].className = "btn btn-warning nom-qua";
    }

    toggleAnswer(event: any, answerId: number, numberOfQuestion: number) {
        this.questions[numberOfQuestion].chosenAnswer[answerId] = !this.questions[numberOfQuestion].chosenAnswer[answerId];
        event.stopImmediatePropagation();
    }

}