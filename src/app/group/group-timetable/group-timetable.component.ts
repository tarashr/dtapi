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

    public pageTitle: string;
    public entity: string = "timeTable";
    public noRecords: boolean = false;
    public entityData: any[] = [];
    public groupId: number;
    public groupName: string;
    public groupEntity: string = "Group";
    public subjectEntity: string = "subject";
    public subjects: any;
    public page: number = 1;
    public limit: number = 0;

    public modalInfoConfig: any = modalInfoConfig;
    public headers: any = headersGroupTimeTable;
    public actions: any = actionsGroupTimeTable;
    public configAdd = configAddGroupTimeTable;
    public configEdit = configEditGroupTimeTable;

    public refreshData = refreshData;
    public successEventModal = successEventModal;
    private subscription: Subscription;

    constructor(private route: ActivatedRoute,
                private crudService: CRUDService,
                private groupService: GroupService,
                private location: Location,
                private modalService: NgbModal) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.groupId = data["groupId"];
            });
    }

    ngOnInit() {
        this.createTitle();
        this.getRecords();
    };

    createTitle() {
        this.crudService.getRecordById(this.groupEntity, this.groupId)
            .subscribe(
                data => {
                    this.groupName = data[0].group_name;
                    this.pageTitle = `Розклад тестування для групи ${this.groupName}`;
                },
                error => console.log("error: ", error)
            );
    };

    getRecords() {
        this.crudService.getRecords(this.subjectEntity)
            .subscribe(
                data => {
                    this.subjects = data;
                    this.getGroupTimeTables();
                },
                error => console.log("error: ", error)
            );
    };

    getGroupTimeTables() {
        this.groupService.getTimeTablesForGroup(this.groupId)
            .subscribe(
                data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                    } else {
                        this.noRecords = false;
                        for (let i in data) {
                            for (let k in this.subjects) {
                                if (data[i].subject_id === this.subjects[k].subject_id) {
                                    data[i].subject_name = this.subjects[k].subject_name;
                                }
                            }
                        }
                        this.createTableConfig(data);
                    }
                },
                error => console.log("error: ", error));
    };

    deleteGroupTimeTable(entity: string, id: number): void {
        this.crudService.delRecord(this.entity, id)
            .subscribe(
                () => {
                    this.getGroupTimeTables();
                },
                error => console.log("error: ", error)
            );
    };

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
    };

    substituteSubjectsNamesWithId(data) {
        this.subjects.forEach((item) => {
            if (item.subject_name === data.select[0].selected) {
                data.select[0].selected = item.subject_id;
            }
        });
    };

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
                this.substituteSubjectsNamesWithId(data);
                const newGroupTimeTable: TimeTable = new TimeTable(
                    this.groupId,
                    `${data.list[0].value.year}-${data.list[0].value.month}-${data.list[0].value.day}`,
                    data.list[1].value,
                    `${data.list[2].value.year}-${data.list[2].value.month}-${data.list[2].value.day}`,
                    data.list[3].value,
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
    };

    editCase(data) {
        let nDate = new Date(data.entityColumns[2]);
        const startDate = {
            "year": nDate.getFullYear(),
            "month": nDate.getMonth() + 1,
            "day": nDate.getDate()
        };

        nDate = new Date(data.entityColumns[4]);
        const endDate = {
            "year": nDate.getFullYear(),
            "month": nDate.getMonth() + 1,
            "day": nDate.getDate()
        };

        this.configEdit.list[0].value = startDate;
        this.configEdit.list[1].value = data.entityColumns[3];
        this.configEdit.list[2].value = endDate;
        this.configEdit.list[3].value = data.entityColumns[5];

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
                this.substituteSubjectsNamesWithId(data);
                const editedGroupTimeTable: TimeTable = new TimeTable(
                    this.groupId,
                    `${data.list[0].value.year}-${data.list[0].value.month}-${data.list[0].value.day}`,
                    data.list[1].value,
                    `${data.list[2].value.year}-${data.list[2].value.month}-${data.list[2].value.day}`,
                    data.list[3].value,
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
    };

    private createTableConfig = (data: any) => {
        let numberOfOrder: number;
        if (data.length) {
            this.entityData = data.map((item, i) => {
                numberOfOrder = i + 1 + (this.page - 1) * this.limit;
                const groupTimetable: any = {};
                groupTimetable.entity_id = item.timetable_id;
                groupTimetable.entityColumns = [
                    numberOfOrder,
                    item.subject_name,
                    item.start_date,
                    item.start_time.slice(0, 5),
                    item.end_date,
                    item.end_time.slice(0, 5)];
                return groupTimetable;
            });
        } else {
            this.noRecords = true;
        }
    };

    goBack(): void {
        this.location.back();
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    };
};