import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {CRUDService}  from "../../shared/services/crud.service";
import {SubjectService}  from "../../shared/services/subject.service";

import {
    configAddQuestion,
    configEditQuestion,
    configAddAnswer,
    successEventModal,
    headersQuestion,
    actionsQuestion,
    modalInfoConfig
} from "../../shared/constant";
import {Question} from "../../shared/classes/question";
import {ModalAddEditComponent} from "../../shared/components/addeditmodal/modal-add-edit.component";
import {InfoModalComponent} from "../../shared/components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription, Observable} from "rxjs";
import {Answer} from "../../shared/classes/answer";
import {CommonService} from "../../shared/services/common.service";

@Component({
    selector: "question-container",
    templateUrl: "question.component.html"
})

export class QuestionComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    // common variables
    public entity: string = "question";
    public errorMessage: string;
    public entityTitle: string = "Завдання для тесту: ";
    public nameOfTest: string;
    public noRecords: boolean = false;
    public subject_id: number;
    public entityTestName: string;
    public test_id: number;
    public headers: any = headersQuestion;
    public actions: any = actionsQuestion;
    public successEventModal = successEventModal;
    public config: any = {action: "create"};
    public isSelect: boolean = true;

    // variable for pagination
    public page: number = 1;
    public limit: number = 5;
    public entityDataLength: number;
    public offset: number = 0;
    public maxSize: number = 5;
    public selectLimit: string = "Виберіть кількість завдань на сторінці";

    // varibles for addedit
    public configAdd = configAddQuestion;
    public configAddAnswer = configAddAnswer;
    public configEdit = configEditQuestion;
    public modalInfoConfig: any = modalInfoConfig;
    public levels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    public selectTypes = ["Простий вибір", "Мультивибір"];
    public selectType = {
        "0": "Простий вибір",
        "1": "Мультивибір"
    };
    public selectAnswer: string[] = ["Не правильно", "Правильно"];
    // public answers = [];
    public answersCount: number;
    public countOfAnswers: number;
    public numberOfAnswer: number = 1;
    // variables for common component
    public entityData: any[] = [];


    constructor(private crudService: CRUDService,
                private route: ActivatedRoute,
                private router: Router,
                private subjectService: SubjectService,
                private location: Location,
                private modalService: NgbModal,
                private commonService: CommonService) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.subject_id = +data["subject_id"];
            });
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.test_id = +params["id"];
        });
        this.getCountRecordsByTest();
        this.getTestBySubjectId();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    goBack(): void {
        this.location.back();

    }

    getTestBySubjectId() {
        this.subjectService.getTestsBySubjectId(this.entityTestName, this.subject_id)
            .subscribe(
                data => {
                    let testArr = data.filter((item) => {
                        return item.test_id == this.test_id;
                    });
                    this.nameOfTest = testArr[0].test_name;
                },
                error => console.log("error: ", error)
            );
    }

    deleteQuestion(entity, id: number): void {
        this.offset = (this.page - 1) * this.limit;
        this.crudService
            .delRecord(entity, id)
            .subscribe(
                () => {
                    this.refreshData("delete");
                },
                error => this.errorMessage = <any>error
            );
    }

    getCountRecordsByTest() {
        this.subjectService.countRecordsByTest(this.test_id)
            .subscribe(
                res => {
                    this.entityDataLength = +res.numberOfRecords;
                    this.getRecordsRangeByTest();
                },
                error => this.errorMessage = <any>error
            );
    }

    private createTableConfig = (data: any) => {
        let tempArr: any[] = [];
        let numberOfOrder: number;
        if (data.length) {
            this.noRecords = false;
            data.forEach((item, i) => {
                numberOfOrder = i + 1 + (this.page - 1) * this.limit;
                let question: any = {};
                question.entity_id = item.question_id;
                question.entityColumns = [
                    numberOfOrder,
                    item.question_text,
                    item.level,
                    this.selectType[+item.type - 1],
                    item.attachment
                ];
                tempArr.push(question);
            });
            this.entityData = tempArr;
        }
    }

    getRecordsRangeByTest(): void {
        this.subjectService.getRecordsRangeByTest(this.test_id, this.limit, this.offset)
            .subscribe(
                data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                    }
                    this.createTableConfig(data);
                },
                error => this.errorMessage = <any>error
            );
    }

    changeLimit(limit: number): void {
        this.limit = limit;
        this.offset = 0;
        this.page = 1;
        this.getRecordsRangeByTest();
    }

    pageChange(num: number) {
        if (!num) {
            this.page = 1;
            return;
        }
        this.page = num;
        this.offset = (this.page - 1) * this.limit;
        this.getRecordsRangeByTest();
    }

    refreshData(action: string) {
        if (action === "delete" && this.entityData.length === 1 && this.entityDataLength > 1) {
            this.offset = (this.page - 2) * this.limit;
            this.page -= 1;
        } else if (this.entityData.length > 1) {
            this.offset = (this.page - 1) * this.limit;
        }
        this.getCountRecordsByTest();
    }

    activate(data: any) {
        switch (data.action) {
            case "answer":
                this.router.navigate(["/admin/subject/test/question", data.entity_id, "answer"],
                    {
                        queryParams: {
                            test_id: this.test_id
                        }
                    });
                break;
            case "edit":
                this.editCase(data);
                break;
            case "delete":
                this.deleteCase(data);
                break;
            case "create":
                this.createCase();
                break;
        }
    }

    createCase() {
        this.configAdd.list[0].value = "";
        this.configAdd.list[1].value = "";
        this.configAdd.img.value = "";
        this.configAdd.select[0].selected = "";
        this.configAdd.select[1].selected = "";
        this.configAdd.select[0].selectItem = this.levels;
        this.configAdd.select[1].selectItem = this.selectTypes;
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                let newQuestion: Question = new Question(
                    data.list[0].value,
                    data.select[0].selected,
                    data.select[1].selectItem.indexOf(data.select[1].selected) + 1,
                    data.img.value,
                    this.test_id
                );
                if (+data.list[1].value) {
                    this.answersCount = this.countOfAnswers = +data.list[1].value;
                    let answers: any[] = [];
                    this.openCreateAnswerModal(newQuestion, answers);
                } else {
                    this.crudService.insertData(this.entity, newQuestion)
                        .subscribe(() => {
                            this.commonService.openModalInfo(`${newQuestion.question_text} успішно створено`);
                        });
                }
            }, () => {
                return;
            });
    };

    openCreateAnswerModal = (newQuestion, answers, value?) => {
        this.configAddAnswer.title = `Відповідь ${this.numberOfAnswer} з ${this.countOfAnswers} до питання:
${newQuestion.question_text}`;
        this.configAddAnswer.list[0].value = value || "";
        this.configAddAnswer.select[0].selected = "";
        this.configAddAnswer.img.value = "";
        this.configAddAnswer.select[0].selectItem = this.selectAnswer;
        const modalRefAddAnswer = this.modalService.open(ModalAddEditComponent);
        modalRefAddAnswer.componentInstance.config = this.configAddAnswer;
        modalRefAddAnswer.result
            .then((data: any) => {
                let isTrue = answers.some(item => {
                    return item.true_answer === 1;
                });
                if (newQuestion.type === 1
                    && !isTrue
                    || newQuestion.type === 2
                    || data.select[0].selectItem.indexOf(data.select[0].selected) === 0) {
                    let newAnswer: Answer = new Answer(
                        data.img.value,
                        data.list[0].value,
                        data.select[0].selectItem.indexOf(data.select[0].selected),
                        0
                    );
                    answers.push(newAnswer);
                    this.answersCount--;
                    this.numberOfAnswer++;
                    if (this.answersCount) {
                        this.openCreateAnswerModal(newQuestion, answers);
                    } else {
                        this.saveQuestionAndAnswers(newQuestion, answers);
                    }
                } else {
                    this.commonService.openModalInfo(`Дозволено вказувати тільки одну правильну відповідь`)
                        .then(
                            this.handleReject,
                            () => {
                                this.openCreateAnswerModal(newQuestion, answers, data.list[0].value);
                            }
                        );
                }
            }, this.handleReject);
    };

    saveQuestionAndAnswers = (question, answers) => {
        this.crudService.insertData(this.entity, question)
            .flatMap(response => {
                this.refreshData("");
                answers.forEach(elem => {
                    elem.question_id = response[0].question_id;
                });
                let forkJoinButch: Observable<any>[] = answers.map(answer => {
                    return this.crudService.insertData("answer", answer);
                });
                return Observable.forkJoin(forkJoinButch);
            })
            .subscribe(() => {
                this.commonService.openModalInfo(`${question.question_text} успішно створено`);
            });
    };

    editCase(data: any) {
        this.configEdit.list[0].value = data.entityColumns[1];
        this.configEdit.id = data.entity_id;
        this.configEdit.select[0].selected = data.entityColumns[2];
        this.configEdit.select[1].selected = data.entityColumns[3];
        this.configEdit.select[0].selectItem = this.levels;
        this.configEdit.select[1].selectItem = this.selectTypes;
        this.configEdit.img.value = data.entityColumns[4];
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                let editedQuestion: Question = new Question(
                    data.list[0].value,
                    data.select[0].selected,
                    data.select[1].selectItem.indexOf(data.select[1].selected) + 1,
                    data.img.value,
                    this.test_id
                );
                this.crudService.updateData(this.entity, data.id, editedQuestion)
                    .subscribe(() => {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, () => {
                return;
            });
    }

    deleteCase(data) {
        this.modalInfoConfig.infoString = `Ви дійсно хочете видалити ${data.entityColumns[0]}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.deleteQuestion(this.entity, data.entity_id);
            }, () => {
                return;
            });
    }

    handleReject = () => {};
}



