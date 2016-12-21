import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

import {Group} from "../shared/classes/group";
import {Faculty} from "../shared/classes/faculty";
import {Speciality} from "../shared/classes/speciality";
import {CRUDService} from "../shared/services/crud.service.ts";
import {CommonService} from "../shared/services/common.service";
import {
    configAddGroup,
    configEditGroup,
    maxSize,
    changeLimit,
    pageChange,
    getCountRecords,
    delRecord,
    successEventModal,
    headersGroup,
    actionsGroup,
    modalInfoConfig
} from "../shared/constant";

@Component({
    templateUrl: "group.component.html"
})
export class GroupComponent implements OnInit, OnDestroy {

    public modalInfoConfig: any = modalInfoConfig;
    public configAdd = configAddGroup;
    public configEdit = configEditGroup;
    public paginationSize = maxSize;
    public headers: any = headersGroup;
    public actions: any = actionsGroup;

    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Групи";
    public selectLimit: string = "Виберіть кількість записів на сторінці";
    public nothingWasChange: string[] = [`Ви не внесли жодних змін. Чи бажаєте повторити редагування?`, "confirm"];
    public entityData: any[] = [];
    private entityDataLength: number;
    public entityDataWithNames: Group[];
    public entity: string = "group";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;

    public facultyEntity: string = "Faculty";
    public isSelectedBy: boolean;
    public specialityId: number;
    public specialityName: string;
    public facultyId: number;
    public facultyName: string;
    public specialityEntity: string = "Speciality";

    public noRecords: boolean = false;
    public sortHide: boolean = false;
    public facultiesNamesIDs: any[] = [];
    public specialitiesNamesIDs: any[] = [];
    public defaultFacultySelect: string = "Виберіть факультет";
    public defaultSpecialitySelect: string = "Виберіть спеціальність";
    private subscription: Subscription;

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public delRecord = delRecord;
    public successEventModal = successEventModal;

    constructor(private crudService: CRUDService,
                private _router: Router,
                private route: ActivatedRoute,
                private commonService: CommonService) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.specialityId = data["specialityId"];
                this.facultyId = data["facultyId"];
            });
    };

    ngOnInit() {
        this.getFacultiesList();
    };

    getFacultiesList() {
        this.crudService.getRecords(this.facultyEntity)
            .subscribe(
                data => {
                    for (let i = 0; i < data.length; i++) {
                        this.facultiesNamesIDs.push({name: data[i].faculty_name, id: data[i].faculty_id});
                        if (this.facultyId === data[i].faculty_id)
                            this.facultyName = data[i].faculty_name;
                    }
                    this.getSpecialityList();
                },
                error => console.log("error: ", error));
    };

    getSpecialityList() {
        this.crudService.getRecords(this.specialityEntity)
            .subscribe(
                data => {
                    for (let i = 0 ; i < data.length; i++) {
                        this.specialitiesNamesIDs.push({name: data[i].speciality_name, id: data[i].speciality_id});
                        if (this.specialityId === data[i].speciality_id)
                            this.specialityName = data[i].speciality_name;
                    }
                    this.formTable();
                },
                error => console.log("error: ", error));
    };

    formTable() {
        if (this.specialityId) {
            this.isSelectedBy = true;
            this.entityTitle = `Групи спеціальності: ${this.specialityName}`;
            this.getGroupsBySpeciality(this.specialityId);
        } else if (this.facultyId) {
            this.isSelectedBy = true;
            this.entityTitle = `Групи факультету: ${this.facultyName}`;
            this.getGroupsByFaculty(this.facultyId);
        } else {
            this.getCountRecords();
        }
    };

    getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                    } else {
                        this.noRecords = false;
                        this.entityDataWithNames = data;
                        this.getFacultyName();
                    }
                },
                error => console.log("error: ", error));
    };

    getGroupsByFaculty(data: any) {
        if (data === "default") {
            this.sortHide = false;
            this.getRecordsRange();
        } else {
            this.noRecords = false;
            this.sortHide = true;
            this.crudService.getGroupsByFaculty(data)
                .subscribe(
                    data => {
                        if (data.response === "no records") {
                            this.noRecords = true;
                        } else {
                            this.entityDataWithNames =  data;
                            this.getFacultyName();
                        }
                    },
                    error => console.log("error: ", error));
        }
    };

    getGroupsBySpeciality(data: any) {
        if (data === "default") {
            this.sortHide = false;
            this.getRecordsRange();
        } else {
            this.sortHide = true;
            this.noRecords = false;
            this.crudService.getGroupsBySpeciality(data)
                .subscribe(
                    data => {
                        if (data.response === "no records") {
                            this.noRecords = true;
                        } else {
                            this.entityDataWithNames =  data;
                            this.getFacultyName();
                        }
                    },
                    error => console.log("error: ", error));
        }
    };

    getFacultyName(): void {
        for (let i in this.entityDataWithNames) {
            for (let k in this.facultiesNamesIDs) {
                if (this.entityDataWithNames[i].faculty_id === this.facultiesNamesIDs[k].id) {
                    this.entityDataWithNames[i].faculty_name = this.facultiesNamesIDs[k].name;
                }
            }
        }
        this.getSpecialityName();
    };

    getSpecialityName(): void {
        for (let i in this.entityDataWithNames) {
            for (let k in this.specialitiesNamesIDs) {
                if (this.entityDataWithNames[i].speciality_id === this.specialitiesNamesIDs[k].id) {
                    this.entityDataWithNames[i].speciality_name = this.specialitiesNamesIDs[k].name;
                }
            }
        }
        this.createTableConfig(this.entityDataWithNames);
    };


    findEntity(searchTerm: string) {
        this.search = searchTerm;

        if (this.search.length === 0) {
            this.offset = 0;
            this.page = 1;
            this.getCountRecords();
        } else {
            this.crudService.getRecordsBySearch(this.entity, this.search)
                .subscribe(data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                        return;
                    } else {
                        this.noRecords = false;
                        this.page = 1;
                        for (let i in data) {
                            for (let k in this.specialitiesNamesIDs) {
                                if (data[i].speciality_id === this.specialitiesNamesIDs[k].id) {
                                    data[i].speciality_name = this.specialitiesNamesIDs[k].name;
                                }
                            }
                            for (let k in this.facultiesNamesIDs) {
                                if (data[i].faculty_id === this.facultiesNamesIDs[k].id) {
                                    data[i].faculty_name = this.facultiesNamesIDs[k].name;
                                }
                            }
                        }
                    }
                    this.createTableConfig(data);
                }, error => console.log("error: ", error));
        }
    };

    private createTableConfig = (data: any) => {
        let numberOfOrder: number;
        this.entityData = data.map((item, i) => {
            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
            const group: any = {};
            group.entity_id = item.group_id;
            group.entityColumns = [numberOfOrder, item.group_name, item.faculty_name, item.speciality_name];
            return group;
        });
    };

    activate(data: any) {
        switch (data.action) {
            case "viewResult":
                this._router.navigate(
                    ["/admin/group/groupTest"],
                    {queryParams: {groupId: data.entity_id}}
                );
                break;
            case "viewTimetable":
                this._router.navigate(
                    ["/admin/group/groupTimetable"],
                    {queryParams: {groupId: data.entity_id}}
                );
                break;
            case "viewStudents":
                this._router.navigate(
                    ["/admin/student/byGroup"],
                    {queryParams: {groupId: data.entity_id}}
                );
                break;
            case "create":
                this.createCase();
                break;
            case "edit":
                this.editCase(data);
                break;
            case "delete":
                this.deleteCase(data);
                break;
        }
    };

    substituteFacultiesNamesWithId(data) {
        this.facultiesNamesIDs.forEach((item) => {
            if (item.name === data.select[0].selected) {
                data.select[0].selected = item.id;
            }
        });
    };

    substituteSpecialitiesNamesWithId(data) {
        this.specialitiesNamesIDs.forEach((item) => {
            if (item.name === data.select[1].selected) {
                data.select[1].selected = item.id;
            }
        });
    };

    createCase() {
        this.configAdd.list[0].value = "";
        this.configAdd.select[0].selected = "";
        this.configAdd.select[0].selectItem = this.facultiesNamesIDs.map(item => {
                return item.name;
        });
        this.configAdd.select[1].selected = "";
        this.configAdd.select[1].selectItem = this.specialitiesNamesIDs.map(item => {
            return item.name;
        });
        this.commonService.openModalAddEdit(this.configAdd)
            .then((data: any) => {
                this.substituteSpecialitiesNamesWithId(data);
                this.substituteFacultiesNamesWithId(data);
                const newGroup: Group = new Group(data.list[0].value,
                                                  data.select[0].selected,
                                                  data.select[1].selected);
                this.crudService.insertData(this.entity, newGroup)
                    .subscribe(response => {
                        this.commonService.openModalInfo(`${data.list[0].value} успішно створено`);
                        this.refreshData(data.action);
                    }, this.errorAddEdit);
            }, () => {
                return;
            });
    };

    editCase(data: any) {
        this.configEdit.list[0].value = data.entityColumns[1];
        this.configEdit.select[0].selected = data.entityColumns[2];
        this.configEdit.id = data.entity_id;
        this.configEdit.select[0].selectItem = this.facultiesNamesIDs.map(item => {
            return item.name;
        });
        this.configEdit.select[1].selected = data.entityColumns[3];
        this.configEdit.select[1].selectItem = this.specialitiesNamesIDs.map(item => {
            return item.name;
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
                    console.log(configData);
                    this.substituteSpecialitiesNamesWithId(configData);
                    this.substituteFacultiesNamesWithId(configData);
                    console.log(configData);
                    const newGroup: Group = new Group(configData.list[0].value,
                        configData.select[0].selected,
                        configData.select[1].selected);
                    this.crudService.updateData(this.entity, configData.id, newGroup)
                        .subscribe(response => {
                            this.commonService.openModalInfo("Редагування пройшло успішно");
                            this.refreshData(data.action);
                        }, this.errorAddEdit);
                }
            }, () => {
                return;
            });
    };

    deleteCase(data: any) {
        let message: string[] = [`Ви дійсно хочете видалити ${data.entityColumns[1]}?`, "confirm", "Видалення"];
        this.commonService.openModalInfo(...message)
            .then(() => {
                this.delRecord(this.entity, data.entity_id);
            }, () => {
                return;
            });
    };

    refreshData(action: string) {
        if (this.specialityId) {
            this.isSelectedBy = true;
            this.entityTitle = `Групи спеціальності: ${this.specialityName}`;
            this.getGroupsBySpeciality(this.specialityId);
        } else if (this.facultyId) {
            this.isSelectedBy = true;
            this.entityTitle = `Групи факультету: ${this.facultyName}`;
            this.getGroupsByFaculty(this.facultyId);
        } else {
            if (action === "delete" && this.entityData.length === 1 && this.entityDataLength > 1) {
                this.offset = (this.page - 2) * this.limit;
                this.page -= 1;
            } else if (this.entityData.length > 1) {
                this.offset = (this.page - 1) * this.limit;
            }

            this.crudService.getCountRecords(this.entity)
                .subscribe(
                    data => {
                        this.entityDataLength = +data.numberOfRecords;
                        this.getRecordsRange();
                    },
                    error => console.log(error)
                );
        }
    };

    errorAddEdit = (error) => {
        let message: string;
        if (error === "400 - Bad Request") {
            message = "Група з такою назвою вже існує";
        } else {
            message = "Невідома помилка! Зверніться до адміністратора.";
        }
        this.commonService.openModalInfo(message);
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    };
}

