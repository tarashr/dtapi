import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {CRUDService}  from "../../shared/services/crud.service";
import {SubjectService}  from "../../shared/services/subject.service";
import {
    configAddTest,
    configEditTest,
    successEventModal,
    actionsTest,
    headersTest,
    modalInfoConfig
} from "../../shared/constant";
import {Test} from "../../shared/classes/test";
import {ModalAddEditComponent} from "../../shared/components/addeditmodal/modal-add-edit.component";
import {InfoModalComponent} from "../../shared/components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";

@Component({
    selector: "test-container",
    templateUrl: "test.component.html"
})

export class TestComponent implements OnInit {

    private subscription: Subscription;

    // common variables
    public pageTitle: string = `Тести по предмету: `;
    public entity: string = "test";
    public errorMessage: string;
    public nameOfSubject: string;
    public subjectEntity: string = "subject";
    public subject_id: number;
    public page: number = 1;
    public limit: number = 0;
    public headers: any = headersTest;
    public actions: any = actionsTest;
    public successEventModal = successEventModal;
    private config: any = {action: "create"};
    public modalInfoConfig: any = modalInfoConfig;
    public noRecords: boolean = false;

    // varibles for addedit
    public configAdd = configAddTest;
    public configEdit = configEditTest;

    // variables for common component
    public entityTitle: string = "Тести";
    public entityData: any[] = [];

    constructor(private crudService: CRUDService,
                private route: ActivatedRoute,
                private router: Router,
                private subjectService: SubjectService,
                private location: Location,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.subject_id = +params["id"];
        });
        this.getTestBySubjectId();
        this.getSubjectName();
    }

    goBack(): void {
        this.location.back();
    }

    getSubjectName() {
        this.crudService.getRecords(this.subjectEntity)
            .subscribe(
                data => {
                    let subjectArr = data.filter((item) => {
                        return item.subject_id == this.subject_id;
                    });
                    this.nameOfSubject = subjectArr[0].subject_name;
                },
                error => console.log("error: ", error)
            );
    }

    private createTableConfig = (data: any) => {
        let tempArr: any[] = [];
        let numberOfOrder: number;
        if (data.length) {
            this.noRecords = false;
            data.forEach((item, i) => {
                numberOfOrder = i + 1 + (this.page - 1) * this.limit;
                let test: any = {};
                test.entity_id = item.test_id;
                test.entityColumns = [
                    numberOfOrder,
                    item.test_name,
                    item.tasks,
                    item.time_for_test,
                    item.attempts,
                    item.enabled
                ];
                test.actions = this.actions;
                tempArr.push(test);
            });
            this.entityData = tempArr;
            for (let i = 0; i < this.entityData.length; i++) {
                this.entityData[i].entityColumns[5] === "1" ?
                    this.entityData[i].entityColumns.splice(5, 1, "Доступно") :
                    this.entityData[i].entityColumns.splice(5, 1, "Не доступно");
            }
        }
    }

    getTestBySubjectId() {
        this.subjectService.getTestsBySubjectId(this.entity, this.subject_id)
            .subscribe(
                data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                    }
                    this.createTableConfig(data);
                },
                error => console.log("error: ", error)
            );
    }

    deleteTest(entity: string, id: number): void {
        this.crudService
            .delRecord(this.entity, id)
            .subscribe(
                () => {
                    this.getTestBySubjectId();
                },
                error => this.errorMessage = <any>error
            );
    }

    activate(data: any) {
        switch (data.action) {
            case "testDetail":
                this.router.navigate(["/admin/subject/test", data.entity_id, "testDetail"], {
                    queryParams: {
                        token: this.subject_id
                    }
                });
                break;
            case "question":
                this.router.navigate(["/admin/subject/test", data.entity_id, "question"], {
                    queryParams: {
                        subject_id: this.subject_id
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
        this.configAdd.list.forEach((item) => {
            item.value = "";
        });
        this.configAdd.select[0].selected = "";
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                let newTest: Test = new Test(data.list[0].value,
                    data.list[1].value,
                    data.list[2].value,
                    data.list[3].value,
                    data.select[0].selectItem.indexOf(data.select[0].selected),
                    this.subject_id);
                this.crudService.insertData(this.entity, newTest)
                    .subscribe(() => {
                        this.modalInfoConfig.infoString = `${data.list[0].value} успішно створено`;
                        this.successEventModal();
                        this.getTestBySubjectId();
                    });
            }, () => {
                return;
            });
    };

    editCase(data) {
        this.configEdit.list.forEach((item, i) => {
            item.value = data.entityColumns[i + 1];
        });
        this.configEdit.id = data.entity_id;
        this.configEdit.select[0].selected = data.entityColumns[5];
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                let editedTest: Test = new Test(data.list[0].value,
                    data.list[1].value,
                    data.list[2].value,
                    data.list[3].value,
                    data.select[0].selectItem.indexOf(data.select[0].selected));
                this.crudService.updateData(this.entity, data.id, editedTest)
                    .subscribe(() => {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.getTestBySubjectId();
                    });
            }, () => {
                return;
            });
    }

    deleteCase(data) {
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати ${data.entityColumns[1]}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.deleteTest(this.entity, data.entity_id);
            }, () => {
                return;
            });
    }
}


