import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {SubjectService} from "../shared/services/subject.service";
import {TestPlayerService} from "../shared/services/test-player.service";


@Component({
    templateUrl: "test-player.component.html",
    styleUrls: ["../studentpart/start-page.component.css", "test-player.component.css"]
})

export class TestPlayerComponent implements OnInit {

    private test: any = {
        test_id: 3,
        test_name: "Система контролю версій",
        subject_id: 1,
        tasks: 5,
        time_for_test: 10,
        enabled: 1,
        attempts: 1
    };

    private navButtons: any[] = [
        {answered: false, name: "01", active: true, className: "btn btn-warning nom-qua"}];

    private activeQuestion: number = 1;
    private questions: any[] = [];
    private questionCount: number = 0;
    private testDetails: any;
    private show: boolean = false;

    constructor(private router: Router,
                private subjectService: SubjectService,
                private testPlayerService: TestPlayerService) {
    }

    ngOnInit() {
        this.subjectService.getTestDetailsByTest(this.test.test_id)
            .subscribe(testDetails => {
                this.testDetails = testDetails;
                testDetails.forEach((item) => {
                    this.subjectService.getQuestionsByLevelRand(item.test_id, item.level, item.tasks)
                        .subscribe(response => {
                            this.questionCount += +item.tasks;
                            response.forEach(question => {
                                this.questions.push(question);
                            });
                            this.questions.sort((a, b) => {
                                return Math.random() > 0.5 ? +a.question_id - +b.question_id : +b.question_id - +a.question_id;
                            });
                            if (this.questionCount === this.test.tasks) {
                                for (let i = 1; i < this.questions.length; i++) {
                                    this.navButtons.push({});
                                    this.navButtons[i].answered = false;
                                    this.navButtons[i].name = i + 1 < 10 ? `0${i + 1}` : i + 1;
                                    this.navButtons[i].className = "btn btn-primary nom-qua";
                                    this.navButtons[i].active = false;
                                }
                                this.questions.forEach((elem) => {
                                    this.testPlayerService.getAnswersByQuestion(elem.question_id)
                                        .subscribe(answers => {
                                            elem.answers = answers;
                                            console.log("full question ", elem.question_id + " : " + JSON.stringify(elem, null, 2));
                                        });
                                });
                                this.show = true;
                                // console.log(JSON.stringify(this.questions, null, 2));
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
        this.activeQuestion === this.questions.length ?
            console.log("Питання закінчились") :
            this.changeActiveQuestion(this.activeQuestion + 1);
    };

    changeActiveQuestion(num: number) {
        if (num === this.activeQuestion) return;
        this.navButtons[this.activeQuestion - 1].answered ?
            this.navButtons[this.activeQuestion - 1].className = "btn btn-success nom-qua" :
            this.navButtons[this.activeQuestion - 1].className = "btn btn-primary nom-qua";
        this.activeQuestion = num;
        this.navButtons[this.activeQuestion - 1].className = "btn btn-warning nom-qua";
    }
}