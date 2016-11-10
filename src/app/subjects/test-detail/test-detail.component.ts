import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {CRUDService}  from "../../shared/services/crud.service";
import {SubjectService}  from "../../shared/services/subject.service";
import {
    configAddTestDetail,
    configEditTestDetail,
    successEventModal,
    headersTestDetail,
    actionsTestDetail,
    modalInfoConfig
} from "../../shared/constant";
import {TestDetail} from "../../shared/classes/test-detail";
import {ModalAddEditComponent} from "../../shared/components/addeditmodal/modal-add-edit.component";
import {InfoModalComponent} from "../../shared/components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";

@Component({
    selector: "test-detail-container",
    templateUrl: "test-detail.component.html"
})

export class TestDetailComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    // common variables
    public entity: string = "testDetail";
    public entityTestName: string = "test";
    public errorMessage: string;
    public pageTitle: string = `Детальніше про тест: `;
    public test_id: number;
    public page: number = 1;
    public limit: number = 0;
    public headers: any = headersTestDetail;
    public actions: any = actionsTestDetail;
    public successEventModal = successEventModal;
    private config: any = {action: "create"};
    public modalInfoConfig: any = modalInfoConfig;
    public noRecords:boolean = false;

    // varibles for addedit
    public configAdd = configAddTestDetail;
    public configEdit = configEditTestDetail;

    // variables for common component
    public entityTitle: string = `Детальніше про тест`;
    public entityData: any[] = [];
    public tasksTest;
    public tasksTestDetail: number = 0;
    public countTask: number = 0;
    public testDetails: any[] = [];
    public subject_id;
    public entityTest = [];
    public testName;
    public level: number [] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    constructor(private crudService: CRUDService,
                private route: ActivatedRoute,
                private router: Router,
                private subjectService: SubjectService,
                private location: Location,
                private modalService: NgbModal) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.subject_id = data["token"];
                this.testName = data["name"];
            });
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.test_id = +params["id"];
        });
        this.getTasks();
        this.getTestDetailsByTest();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getTasks() {
        this.subject_id = +this.subject_id;
        this.subjectService.getTestsBySubjectId(this.entityTestName, this.subject_id)
            .subscribe(
                data => {
                    data.forEach(item => {
                        if (item.test_id == this.test_id) {
                            this.tasksTest = item.tasks;
                        }
                    });
                },
                error => console.log("error: ", error)
            );
    }

    goBack(): void {
        this.location.back();

    }

    getTestDetailsByTest() {
        this.subjectService.getTestDetailsByTest(this.test_id)
            .subscribe(
                data => {
                    if (data.response === "no records"){
                        this.noRecords = true;
                    }
                    let tempArr: any[] = [];
                    let numberOfOrder: number;
                    if (data.length) {
                        data.forEach((item, i) => {
                            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
                            let testDetail: any = {};
                            testDetail.entity_id = item.id;
                            testDetail.entityColumns = [
                                numberOfOrder,
                                item.level,
                                item.tasks,
                                item.rate
                            ];

                            testDetail.actions = this.actions;
                            tempArr.push(testDetail);
                        });
                        this.entityData = tempArr;
                    }
                },
                error => console.log("error: ", error)
            );
    }

    deleteTestDetail(entity: string, id: number): void {
        this.crudService
            .delRecord(this.entity, id)
            .subscribe(
                () => {
                    this.getTestDetailsByTest();
                },
                error => this.errorMessage = <any>error
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
        this.configAdd.list.forEach(item => {
            item.value = "";
        });
        this.configAdd.select[0].selected = "";
        this.configAdd.select[0].selectItem = [];
        this.configAdd.select[0].selectItem = this.level;
        this.tasksTestDetail = 0;
        this.subjectService.getTestDetailsByTest(this.test_id)
            .subscribe(
                res => {
                    this.testDetails = res;
                    this.testDetails.forEach((item) => {
                        this.tasksTestDetail += (+item.tasks);
                    });
                },
                error => this.errorMessage = <any>error);
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                if (+this.tasksTest >= +(this.tasksTestDetail + +data.list[0].value)) {
                    let newTestDetail: TestDetail = new TestDetail(
                        data.select[0].selected,
                        data.list[0].value,
                        data.list[1].value,
                        this.test_id);
                    this.crudService.insertData(this.entity, newTestDetail)
                        .subscribe(() => {
                            this.modalInfoConfig.infoString = `Параметр тесту успішно створено`;
                            this.successEventModal();
                            this.getTestDetailsByTest();
                        });
                } else {
                    this.modalInfoConfig.infoString = `Перевищено максимальну кількість завдань`;
                    this.successEventModal();
                }
            }, () => {
                return;
            });
    };

    editCase(data) {
        this.configEdit.list[0].value = data.entityColumns[2];
        this.configEdit.list[1].value = data.entityColumns[3];
        this.configEdit.select[0].selected = data.entityColumns[1];
        this.configEdit.select[0].selectItem = this.level;
        this.tasksTestDetail = 0;
        this.subjectService.getTestDetailsByTest(this.test_id)
            .subscribe(
                res => {
                    this.testDetails = res;
                    this.testDetails.forEach((item) => {
                        this.tasksTestDetail += (+item.tasks);
                    });
                },
                error => this.errorMessage = <any>error);
        this.configEdit.id = data.entity_id;
        this.tasksTestDetail -= data.entityColumns[2];
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                if (+this.tasksTest >= +(this.tasksTestDetail + +data.list[0].value)) {
                    let editedTestDetail: TestDetail = new TestDetail(
                        data.select[0].selected,
                        data.list[0].value,
                        data.list[1].value);
                    this.crudService.updateData(this.entity, data.id, editedTestDetail)
                        .subscribe(() => {
                            this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                            this.successEventModal();
                            this.getTestDetailsByTest();
                        });
                } else {
                    this.modalInfoConfig.infoString = `Перевищено максимальну кількість завдань`;
                    this.successEventModal();
                }
            }, () => {
                return;
            });
    }

    deleteCase(data) {
        this.modalInfoConfig.infoString = `Підтвердіть видалення параметру тесту`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.deleteTestDetail(this.entity, data.entity_id);
            }, () => {
                return;
            });
    }
}



