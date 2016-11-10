import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {CRUDService}  from "../../shared/services/crud.service";
import {SubjectService}  from "../../shared/services/subject.service";

import {
    configAddAnswer,
    configEditAnswer,
    successEventModal,
    headersQuestion,
    actionsQuestion,
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
    public numberOfQuestion;
    public noRecords: boolean = false;

    public question_id: number;
    public headers: any = headersQuestion;
    public actions: any = actionsQuestion;
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
                this.numberOfQuestion = data["numberOfQuestion"];
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

    getAnswerByQuestion() {
        this.subjectService.getAnswerByQuestion(this.question_id)
            .subscribe(
                data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                    }
                    if (data.length) {
                        this.entityData = data;
                        this.noRecords = false;
                    }
                },
                error => console.log("error: ", error)
            );
    }

    createCase() {
        this.configAdd.list[0].value = "";
        this.configAdd.list[1].value = "";
        this.configAdd.img[0].value = "";
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                let newAnswer: Answer = new Answer(
                    data.img[0].value,
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

    editCase(entity: any) {
        this.configEdit.list[0].value = entity.answer_text;
        this.configEdit.list[1].value = entity.true_answer;
        this.configEdit.img[0].value = entity.attachment;
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                let editedAnswer: Answer = new Answer(
                    data.img[0].value,
                    data.list[0].value,
                    data.list[1].value,
                    this.question_id
                );
                this.crudService.updateData(this.entity, entity.answer_id, editedAnswer)
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
                this.deleteAnswer(this.entity, data.answer_id);
            }, () => {
                return;
            });
    }

}



