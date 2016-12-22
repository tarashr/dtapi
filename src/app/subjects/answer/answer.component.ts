import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {CRUDService}  from "../../shared/services/crud.service";
import {SubjectService}  from "../../shared/services/subject.service";

import {
    configAddAnswer,
    configEditAnswer,
    successEventModal,
    headersAnswer,
    actionsAnswer,
    modalInfoConfig
} from "../../shared/constant";
import {Answer} from "../../shared/classes/answer";
import {ModalAddEditComponent} from "../../shared/components/addeditmodal/modal-add-edit.component";
import {InfoModalComponent} from "../../shared/components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {CommonService} from "../../shared/services/common.service";

@Component({
    selector: "answer-container",
    templateUrl: "answer.component.html"
})

export class AnswerComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    // common variables
    public entity: string = "answer";
    public errorMessage: string;
    public entityTitle: string = "Відповіді до завдання: ";
    public noRecords: boolean = false;
    public page: number = 1;

    public test_id: number;
    public question_id: number;
    public limit: number = 20;
    public offset: number = 0;
    public questionEntity: string = "question";
    public questionArr: any[] = [];
    public nameOfQuestion: string;
    public headers: any = headersAnswer;
    public actions: any = actionsAnswer;
    public successEventModal = successEventModal;
    public config: any = {action: "create"};

    // varibles for addedit
    public configAdd = configAddAnswer;
    public configEdit = configEditAnswer;
    public modalInfoConfig: any = modalInfoConfig;

    // variables for table
    public entityData: any[] = [];
    public answer: {} = {
        "0": "Не правильно",
        "1": "Правильно"
    };
    public selectAnswer: string[] = ["Не правильно", "Правильно"];

    constructor(private crudService: CRUDService,
                private route: ActivatedRoute,
                private router: Router,
                private subjectService: SubjectService,
                private location: Location,
                private modalService: NgbModal,
                private commonService: CommonService) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.test_id = data["test_id"];
            });

    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.question_id = +params["id"];
        });
        this.getAnswerByQuestion();
        this.getQuestionRangeByTest();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    goBack(): void {
        this.location.back();

    }

    getQuestionRangeByTest(): void {
        this.subjectService.getRecordsRangeByTest(this.test_id, this.limit, this.offset)
            .subscribe(
                data => {
                    this.questionArr = data.filter((item) => {
                        return item.question_id == this.question_id;
                    });
                    this.nameOfQuestion = this.questionArr[0].question_text;
                },
                error => this.errorMessage = <any>error
            )

    }

    deleteAnswer(entity, id: number): void {
        this.crudService
            .delRecord(entity, id)
            .subscribe(
                () => {
                    this.getAnswerByQuestion();
                },
                error => this.errorMessage = <any>error
            );
    }

    private createTableConfig = (data: any) => {
        let tempArr: any[] = [];
        if (data.length) {
            this.noRecords = false;
            data.forEach((item) => {
                let answer: any = {};
                answer.entity_id = item.answer_id;
                answer.entityColumns = [
                    item.answer_text,
                    item.attachment,
                    this.answer[item.true_answer]
                ];
                tempArr.push(answer);
            });
            this.entityData = tempArr;
        }
    }

    getAnswerByQuestion() {
        this.subjectService.getAnswerByQuestion(this.question_id)
            .subscribe(
                data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                    }
                    if (data.length) {
                        this.createTableConfig(data);
                        this.noRecords = false;
                    }
                },
                error => this.commonService.handleError(error)
            );
    }

    activate(data: any) {
        switch (data.action) {
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
        let isTrue = this.entityData.some(item => {
            return this.selectAnswer.indexOf(item.entityColumns[2]) === 1;
        });
        this.configAdd.title = "Додати нову відповідь";
        this.configAdd.list[0].value = "";
        this.configAdd.select[0].selected = "";
        this.configAdd.img.value = "";
        this.configAdd.select[0].selectItem = this.selectAnswer;
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                if (this.questionArr[0].type == "1"
                    && !isTrue
                    || this.questionArr[0].type == "2"
                    || data.select[0].selectItem.indexOf(data.select[0].selected) == 0) {
                    let newAnswer: Answer = new Answer(
                        data.img.value,
                        data.list[0].value,
                        data.select[0].selectItem.indexOf(data.select[0].selected),
                        this.question_id
                    );
                    this.crudService.insertData(this.entity, newAnswer)
                        .subscribe(() => {
                            this.modalInfoConfig.infoString = `Відповідь успішно створено`;
                            this.successEventModal();
                            this.getAnswerByQuestion();
                        });
                } else {
                    this.modalInfoConfig.infoString = `Дозволено вказувати тільки одну правильну відповідь`;
                    this.successEventModal();
                }
            }, () => {
                return;
            });
    };

    editCase(data: any) {
        let isTrue = this.entityData.some(item => {
            return this.selectAnswer.indexOf(item.entityColumns[2]) === 1;
        });
        this.configEdit.list[0].value = data.entityColumns[0];
        this.configEdit.select[0].selected = data.entityColumns[2];
        this.configEdit.img.value = data.entityColumns[1];
        this.configEdit.id = data.entity_id;
        this.configEdit.select[0].selectItem = this.selectAnswer;
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                if (this.questionArr[0].type == "1"
                    && !isTrue
                    || this.questionArr[0].type == "2"
                    || data.select[0].selectItem.indexOf(data.select[0].selected) == 0) {
                    let editedAnswer: Answer = new Answer(
                        data.img.value,
                        data.list[0].value,
                        data.select[0].selectItem.indexOf(data.select[0].selected),
                        this.question_id
                    );
                    this.crudService.updateData(this.entity, data.id, editedAnswer)
                        .subscribe(() => {
                            this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                            this.successEventModal();
                            this.getAnswerByQuestion();
                        });
                } else {
                    this.modalInfoConfig.infoString = `Дозволено вказувати тільки одну правильну відповідь`;
                    this.successEventModal();
                }
            }, () => {
                return;
            });
    }

    deleteCase(data) {
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати відповідь`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.deleteAnswer(this.entity, data.entity_id);
            }, () => {
                return;
            });
    }

}



