import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {CRUDService}  from "../../shared/services/crud.service";
import {SubjectService}  from "../../shared/services/subject.service";
import {
    configAddTimeTable,
    configEditTimeTable,
    successEventModal,
    headersTimeTable,
    actionsTimeTable,
    modalInfoConfig} from "../../shared/constant";
import {TimeTable} from "../../shared/classes/timetable";
import {ModalAddEditComponent} from "../../shared/components/addeditmodal/modal-add-edit.component";
import {InfoModalComponent} from "../../shared/components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EntityManagerBody} from "../../shared/classes/entity-manager-body";
import {Subscription} from "rxjs";

@Component({
    selector: "timetable-container",
    templateUrl: "timetable.component.html"
})

export class TimeTableComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    // common variables
    public entity: string = "timeTable";
    public subjectName: string;
    public errorMessage: string;
    public pageTitle: string = "Розклад тестів по предмету: ";
    public subject_id: number;
    public page: number = 1;
    public limit: number = 0;
    public headers: any = headersTimeTable;
    public actions: any = actionsTimeTable;
    public successEventModal = successEventModal;
    private config: any = {action: "create"};
    public modalInfoConfig: any = modalInfoConfig;
    public noRecords: boolean = false;

    // varibles for addedit
    public configAdd = configAddTimeTable;
    public configEdit = configEditTimeTable;

    // variables for common component
    public entityTitle: string = "Розклад тестів";
    public entityData: any[] = [];
    public groups = [];
    public entityGroup = "group";

    constructor(private crudService: CRUDService,
                private route: ActivatedRoute,
                private router: Router,
                private subjectService: SubjectService,
                private location: Location,
                private modalService: NgbModal) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.subjectName = data["token"];
            });
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.subject_id = +params["id"];
        });
        this.getGroups();
    }

    goBack(): void {
        this.location.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getTimeTableForSubject() {
        this.subjectService.getTimeTableForSubject(this.entity, this.subject_id)
            .subscribe(
                data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                    }
                    if (data.length) {
                        this.noRecords = false;
                        for (let i = 0; i < data.length; i++) {
                            for (let j = 0; j < this.groups.length; j++) {
                                if (data[i].group_id === this.groups[j].group_id) {
                                    data[i].group_name = this.groups[j].group_name;
                                }
                            }
                        }
                        this.createTableConfig(data);
                    }
                },
                error => console.log("error: ", error)
            );
    }

    private createTableConfig = (data: any) => {
        let tempArr: any[] = [];
        let numberOfOrder: number;
        if (data.length) {
            data.forEach((item, i) => {
                numberOfOrder = i + 1 + (this.page - 1) * this.limit;
                let timetable: any = {};
                timetable.entity_id = item.timetable_id;
                timetable.entityColumns = [numberOfOrder, item.group_name, item.event_date];
                timetable.actions = this.actions;
                tempArr.push(timetable);
            });
            this.entityData = tempArr;
        }
    };

    getGroups() {
        this.crudService.getRecords(this.entityGroup)
            .subscribe(
                data => {
                    this.groups = data;
                    this.getTimeTableForSubject();
                },
                error => console.log("error: ", error),
            );
    }

    deleteTimeTable(entity: string, id: number): void {
        this.crudService
            .delRecord(this.entity, id)
            .subscribe(
                () => {
                    this.getTimeTableForSubject();
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


    substituteNameGroupWithId(data) {
        this.groups.forEach((item) => {
            if (item.group_name === data.select[0].selected) {
                data.select[0].selected = item.group_id;
            }
        });
    }

    createCase() {
        this.configAdd.list.forEach((item) => {
            item.value = "";
        });
        this.configAdd.select[0].selected = "";
        this.configAdd.select[0].selectItem = [];
        this.groups.forEach(item => {
            this.configAdd.select[0].selectItem.push(item.group_name);
        });
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                this.substituteNameGroupWithId(data);
                let newTimeTable: TimeTable = new TimeTable(
                    data.select[0].selected,
                    data.list[0].value = `${data.list[0].value.year}-${data.list[0].value.month}-${data.list[0].value.day}`||data.list[0].value,
                    this.subject_id);
                this.crudService.insertData(this.entity, newTimeTable)
                    .subscribe(() => {
                        this.modalInfoConfig.infoString = `Новий розклад для групи ${data.select[0].selected} успішно створено`;
                        this.successEventModal();
                        this.getTimeTableForSubject();
                    });
            }, () => {
                return;
            });
    };

    editCase(data) {
        this.configEdit.list[0].value = "";
        this.configEdit.select[0].selected = data.entityColumns[1];
        this.configEdit.id = data.entity_id;
        this.configEdit.select[0].selectItem = [];
        this.groups.forEach(item => {
            this.configEdit.select[0].selectItem.push(item.group_name);
        });
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.componentInstance.placeholder = data.entityColumns[2];
        modalRefEdit.result
            .then((data: any) => {
                this.substituteNameGroupWithId(data);
                let editedTimeTable: TimeTable = new TimeTable(
                    data.select[0].selected,
                    data.list[0].value = `${data.list[0].value.year}-${data.list[0].value.month}-${data.list[0].value.day}`||data.list[0].value,
                );
                this.crudService.updateData(this.entity, data.id, editedTimeTable)
                    .subscribe(() => {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.getTimeTableForSubject();
                    });
            }, () => {
                return;
            });
    }

    deleteCase(data) {
        this.modalInfoConfig.infoString = `Ви дійсно хочете видалити ${data.entityColumns[1]}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.deleteTimeTable(this.entity, data.entity_id);
                this.getTimeTableForSubject();
            }, () => {
                return;
            });
    }
}


