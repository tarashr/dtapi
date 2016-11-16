import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";

import {CRUDService} from "../../shared/services/crud.service";
import {GroupService} from "../../shared/services/group.service";
import {TimeTable} from "../../shared/classes/timetable";
import {InfoModalComponent} from "../../shared/components/info-modal/info-modal.component";
import {ModalAddEditComponent} from "../../shared/components/addeditmodal/modal-add-edit.component";
import {
    headersGroupTimeTable,
    actionsGroupTimeTable,
    configAddGroupTimeTable,
    configEditGroupTimeTable,
    modalInfoConfig,
    refreshData,
    successEventModal
} from "../../shared/constant";



@Component({
    templateUrl: "group-timetable.component.html"
})
export class GroupTimetableComponent implements OnInit {

    public pageTitle: string = "Розклад тестування для групи: ";
    public entity: string = "timeTable";
    public noRecords: boolean = false;
    public entityData: any[] = [];
    public groupId: number;
    public groupName: string;
    public subjectEntity: string = "subject";
    public subjects: any;

    public page: number = 1;
    public limit: number = 0;

    public headers: any = headersGroupTimeTable;
    public actions: any = actionsGroupTimeTable;
    public configAdd = configAddGroupTimeTable;
    public configEdit = configEditGroupTimeTable;

    public modalInfoConfig: any = modalInfoConfig;
    public refreshData = refreshData;
    public successEventModal = successEventModal;
    private subscription: Subscription;

    constructor(
                private route: ActivatedRoute,
                private crudService: CRUDService,
                private groupService: GroupService,
                private location: Location,
                private modalService: NgbModal) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.groupId = data["groupId"];
                this.groupName = data["groupName"];
            });
    };

    ngOnInit() {
        this.getRecords();
    }

    getGroupTimeTables() {
        this.groupService.getTimeTablesForGroup(this.groupId)
            .subscribe(
                data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                        return;
                    }
                    for (let i in data) {
                        this.noRecords = false;
                        for (let k in this.subjects) {
                            if (data[i].subject_id === this.subjects[k].subject_id) {
                                data[i].subject_name = this.subjects[k].subject_name;
                            }
                        }
                    }
                    this.createTableConfig(data);
                },
                error => console.log("error: ", error));
    }

    getRecords() {
        this.crudService.getRecords(this.subjectEntity)
            .subscribe(
                data => {
                    this.subjects = data;
                    this.getGroupTimeTables();
                },
                error => console.log("error: ", error)
            );
    }

    deleteGroupTimeTable(entity: string, id: number): void {
        this.crudService
            .delRecord(this.entity, id)
            .subscribe(
                () => {
                    this.getGroupTimeTables();
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

    substituteNameSubjectsWithId(data) {
        this.subjects.forEach((item) => {
            if (item.subject_name === data.select[0].selected) {
                data.select[0].selected = item.subject_id;
            }
        });
    }

    createCase() {
        this.configAdd.list.forEach((item) => {
            item.value = "";
        });
        this.configAdd.select[0].selected = "";
        this.configAdd.select[0].selectItem = [];
        this.subjects.forEach(item => {
            this.configAdd.select[0].selectItem.push(item.subject_name);
        });
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                this.substituteNameSubjectsWithId(data);
                let newGroupTimeTable: TimeTable = new TimeTable(
                    this.groupId,
                    data.list[0].value = `${data.list[0].value.year}-${data.list[0].value.month}-${data.list[0].value.day}`,
                    data.select[0].selected
                );
                this.crudService.insertData(this.entity, newGroupTimeTable)
                    .subscribe(response => {
                        this.modalInfoConfig.infoString = `Тестування назначено`;
                        this.successEventModal();
                        this.getGroupTimeTables();
                    });
            }, () => {
                return;
            });
    }

    editCase(data) {
        let nDate = new Date(data.entityColumns[2]);
        let newDate = {
            "year": nDate.getFullYear(),
            "month": nDate.getMonth() + 1,
            "day": nDate.getDate()
        };
        this.configEdit.list[0].value = newDate;
        this.configEdit.select[0].selected = data.entityColumns[1];
        this.configEdit.id = data.entity_id;
        this.configEdit.select[0].selectItem = [];
        this.subjects.forEach(item => {
            this.configEdit.select[0].selectItem.push(item.subject_name);
        });
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                this.substituteNameSubjectsWithId(data);
                let editedGroupTimeTable: TimeTable = new TimeTable(
                    this.groupId,
                    data.list[0].value = `${data.list[0].value.year}-${data.list[0].value.month}-${data.list[0].value.day}`,
                    data.select[0].selected
                );
                this.crudService.updateData(this.entity, data.id, editedGroupTimeTable)
                    .subscribe(() => {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.getGroupTimeTables();
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
                this.deleteGroupTimeTable(this.entity, data.entity_id);
            }, () => {
                return;
            });
    }

    goBack(): void {
        this.location.back();
    }

    private createTableConfig = (data: any) => {
        let tempArr: any[] = [];
        let numberOfOrder: number;
        if (data.length) {
            data.forEach((item, i) => {
                numberOfOrder = i + 1 + (this.page - 1) * this.limit;
                let groupTimetable: any = {};
                groupTimetable.entity_id = item.timetable_id;
                groupTimetable.entityColumns = [numberOfOrder, item.subject_name, item.event_date];
                tempArr.push(groupTimetable);
            });
            this.entityData = tempArr;
        }
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}