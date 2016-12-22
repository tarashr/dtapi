import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";

import {CRUDService} from "../../shared/services/crud.service";
import {GroupService} from "../../shared/services/group.service";
import {TimeTable} from "../../shared/classes/timetable";
import {CommonService} from "../../shared/services/common.service";
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
    public nothingWasChange: string[] = [`Ви не внесли жодних змін. Чи бажаєте повторити редагування?`, "confirm"];
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
                private modalService: NgbModal,
                private commonService: CommonService) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.groupId = data["groupId"];
            });
    }

    ngOnInit() {
        this.createTitle();
        this.getRecords();
    };

    createTitle(): void {
        this.crudService.getRecordById(this.groupEntity, this.groupId)
            .subscribe(
                data => {
                    this.groupName = data[0].group_name;
                    this.pageTitle = `Розклад тестування для групи ${this.groupName}`;
                },
                error => this.commonService.handleError(error)
            );
    };

    getRecords(): void {
        this.crudService.getRecords(this.subjectEntity)
            .subscribe(
                data => {
                    this.subjects = data;
                    this.getGroupTimeTables();
                },
                error => this.commonService.handleError(error)
            );
    };

    getGroupTimeTables(): void {
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
                error => this.commonService.handleError(error)
            );
    };

    deleteGroupTimeTable(entity: string, id: number): void {
        this.crudService.delRecord(this.entity, id)
            .subscribe(
                () => {
                    this.getGroupTimeTables();
                },
                error => this.commonService.handleError(error)
            );
    };

    activate(data: any): void {
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

    substituteSubjectsNamesWithId(data: any): void {
        this.subjects.forEach((item) => {
            if (item.subject_name === data.select[0].selected) {
                data.select[0].selected = item.subject_id;
            }
        });
    };

    createCase(): void {
        this.configAdd.list.forEach((item) => {
            item.value = "";
        });
        this.configAdd.select[0].selected = "";
        this.configAdd.select[0].selectItem = [];
        this.subjects.forEach(item => {
            this.configAdd.select[0].selectItem.push(item.subject_name);
        });
        this.commonService.openModalAddEdit(this.configAdd)
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
                        this.commonService.openModalInfo("Тестування назначено");
                        this.getGroupTimeTables();
                    }, this.errorAddEdit);
            }, () => {
                return;
            });
    };

    editCase(data: any): void {
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
        const list = JSON.stringify(this.configEdit);
        this.commonService.openModalAddEdit(this.configEdit)
            .then((configData: any) => {
                const newList = JSON.stringify(configData);
                if (list === newList) {
                    this.commonService.openModalInfo(...this.nothingWasChange)
                        .then(() => {
                            this.editCase(data);
                        }, () => {
                            return;
                        });
                } else {
                    this.substituteSubjectsNamesWithId(configData);
                    const editedGroupTimeTable: TimeTable = new TimeTable(
                        this.groupId,
                        `${configData.list[0].value.year}-${configData.list[0].value.month}-${configData.list[0].value.day}`,
                        configData.list[1].value,
                        `${configData.list[2].value.year}-${configData.list[2].value.month}-${configData.list[2].value.day}`,
                        configData.list[3].value,
                        configData.select[0].selected
                    );
                    this.crudService.updateData(this.entity, configData.id, editedGroupTimeTable)
                        .subscribe(() => {
                            this.commonService.openModalInfo("Редагування пройшло успішно");
                            this.getGroupTimeTables();
                        }, this.errorAddEdit);
                }
            }, () => {
                return;
            });
    }

    deleteCase(data: any): void {
        let message: string[] = [`Ви дійсно хочете видалити ${data.entityColumns[1]}?`, "confirm", "Видалення"];
        this.commonService.openModalInfo(...message)
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

    errorAddEdit = (error) => {
        let message: string;
        if (error === "400 - Bad Request") {
            message = "Для даної групи вже назначено тестування з даного предмету";
        } else {
            message = "Невідома помилка! Зверніться до адміністратора.";
        }
        this.commonService.openModalInfo(message);
    };

    goBack(): void {
        this.location.back();
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    };
}