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

@Component({
    selector: "answer-container",
    templateUrl: "answer.component.html"
})

export class AnswerComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    // common variables
    public entity: string = "answer";
    public errorMessage: string;
    public entityTitle: string = "Відповіді до завдання №: ";
    public nameOfQuestion: string;
    public noRecords: boolean = false;
    public page: number = 1;
    public limit: number = 0;

    public question_id: number;
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

    constructor(private crudService: CRUDService,
                private route: ActivatedRoute,
                private router: Router,
                private subjectService: SubjectService,
                private location: Location,
                private modalService: NgbModal) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.nameOfQuestion = data["nameOfQuestion"];
            });
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.question_id = +params["id"];
        });
        this.getAnswerByQuestion();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    goBack(): void {
        this.location.back();

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
                    item.true_answer
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
                error => console.log("error: ", error)
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
        this.configAdd.list[0].value = "";
        this.configAdd.list[1].value = "";
        this.configAdd.img.value = "";
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                let newAnswer: Answer = new Answer(
                    data.img.value,
                    data.list[0].value,
                    data.list[1].value,
                    this.question_id
                );
                this.crudService.insertData(this.entity, newAnswer)
                    .subscribe(() => {
                        this.modalInfoConfig.infoString = `Відповідь успішно створено`;
                        this.successEventModal();
                        this.getAnswerByQuestion();
                    });
            }, () => {
                return;
            });
    };

    editCase(data: any) {
        this.configEdit.list[0].value = data.entityColumns[0];
        this.configEdit.list[1].value = data.entityColumns[2];
        this.configEdit.img.value = data.entityColumns[1];
        this.configEdit.id = data.entity_id;
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                let editedAnswer: Answer = new Answer(
                    data.img.value,
                    data.list[0].value,
                    data.list[1].value,
                    this.question_id
                );
                this.crudService.updateData(this.entity, data.id, editedAnswer)
                    .subscribe(() => {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.getAnswerByQuestion();
                    });
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



