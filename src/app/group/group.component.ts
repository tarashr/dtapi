import {Component, OnInit, OnDestroy} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

import {Group} from "../shared/classes/group";
import {Faculty} from "../shared/classes/faculty";
import {Speciality} from "../shared/classes/speciality";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {ModalAddEditComponent} from "../shared/components/addeditmodal/modal-add-edit.component";
import {EntityManagerBody} from "../shared/classes/entity-manager-body";
import {CRUDService} from "../shared/services/crud.service.ts";
import {
    configAddGroup,
    configEditGroup,
    maxSize,
    changeLimit,
    pageChange,
    getCountRecords,
    delRecord,
    refreshData,
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

    // constants for view
    public addTitle: string = "Створити нову групу";
    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Групи";
    public selectLimit: string = "Виберіть кількість записів на сторінці";
    //

    public entityData: any[] = [];
    private entityDataLength: number;
    public entityDataWithNames: Group[];
    public entity: string = "group";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;

    public facultyEntity: string = "Faculty";
    public faculties: Faculty[] = [];
    public isSelectedBy: boolean;
    public specialityId: number;
    public specialityName: string;
    public facultyId: number;
    public facultyName: string;
    public specialityEntity: string = "Speciality";
    public specialities: Speciality[] = [];

    public noRecords: boolean = false;
    private subscription: Subscription;
    public facultiesNamesIDs: any[] = [];
    public specialitiesNamesIDs: any[] = [];
    public defaultFacultySelect: string = "Виберіть факультет";
    public defaultSpecialitySelect: string = "Виберіть спеціальність";

    constructor(private crudService: CRUDService,
                private _router: Router,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.specialityId = data["specialityId"];
                this.facultyId = data["facultyId"];
            });
    };

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public delRecord = delRecord;
    public refreshData = refreshData;
    public successEventModal = successEventModal;
    public sortHide: boolean = false;

    ngOnInit() {
        this.getFacultiesList();
    }

    getFacultiesList() {
        this.crudService.getRecords("Faculty")
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
        this.crudService.getRecords("Speciality")
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
        }
        else {
            this.getCountRecords();
        }
    }

    getRecordsRange() {
        this.noRecords = false;
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    this.entityDataWithNames =  data;
                    this.getFacultyName();
                },
                error => console.log("error: ", error));
    };

    getGroupsByFaculty(data: any) {
        if (data === "default") {
            this.sortHide = false;
            this.noRecords = false;
            this.getRecordsRange();
        } else {
            this.sortHide = true;
            this.noRecords = false;
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
            this.noRecords = false;
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
                            console.log(this.entityDataWithNames);
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
    }

    getSpecialityName(): void {
        for (let i in this.entityDataWithNames) {
            for (let k in this.specialitiesNamesIDs) {
                if (this.entityDataWithNames[i].speciality_id === this.specialitiesNamesIDs[k].id) {
                    this.entityDataWithNames[i].speciality_name = this.specialitiesNamesIDs[k].name;
                }
            }
        }
        this.createTableConfig(this.entityDataWithNames);
    }


    findEntity(searchTerm: string) {
        this.search = searchTerm;

        if (this.search.length === 0) {
            this.offset = 0;
            this.page = 1;
            this.getCountRecords();
            return;
        }

        this.crudService.getRecordsBySearch(this.entity, this.search)
            .subscribe(data => {
                if (data.response === "no records") {
                    this.noRecords = true;
                    return;
                }
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
                this.createTableConfig(data);
            }, error => console.log("error: ", error));
    };

    private createTableConfig = (data: any) => {
        let tempArr: any[] = [];
        let numberOfOrder: number;
        data.forEach((item, i) => {
            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
            let group: any = {};
            group.entity_id = item.group_id;
            group.entityColumns = [numberOfOrder, item.group_name, item.faculty_name, item.speciality_name];
            tempArr.push(group);
        });
        this.entityData = tempArr;
    };

    activate(data: any) {
        switch (data.action) {
            case "viewTimetable":
                this._router.navigate(
                    ["/admin/group/groupTimetable"],
                    {queryParams: {groupId: data.entity_id, groupName: data.entityColumns[1]}}
                );
                break;
            case "viewStudents":
                this._router.navigate(
                    ["/admin/student/byGroup"],
                    {queryParams: {groupId: data.entity_id, groupName: data.entityColumns[1]}}
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
    }

    substituteFacultiesNamesOnId(data) {
        this.facultiesNamesIDs.forEach((item) => {
            if (item.name === data.select[0].selected) {
                data.select[0].selected = item.id;
            }
        });
    }

    substituteSpecialitiesNamesOnId(data) {
        this.specialitiesNamesIDs.forEach((item) => {
            if (item.name === data.select[1].selected) {
                data.select[1].selected = item.id;
            }
        });
    }

    createCase() {
        this.configAdd.list.forEach((item) => {
            item.value = "";
        });
        this.configAdd.select[0].selected = "";
        this.configAdd.select[0].selectItem = [];
        this.facultiesNamesIDs.forEach(item => {
            this.configAdd.select[0].selectItem.push(item.name);
        });
        this.configAdd.select[1].selected = "";
        this.configAdd.select[1].selectItem = [];
        this.specialitiesNamesIDs.forEach(item => {
            this.configAdd.select[1].selectItem.push(item.name);
        });
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                this.substituteSpecialitiesNamesOnId(data);
                this.substituteFacultiesNamesOnId(data);
                let newGroup: Group = new Group(data.list[0].value,
                                                data.select[0].selected,
                                                data.select[1].selected);
                this.crudService.insertData(this.entity, newGroup)
                    .subscribe(response => {
                        this.modalInfoConfig.infoString = `${data.list[0].value} успішно створено`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, () => {
                return;
            });
    };

    editCase(data: any) {
        this.configEdit.list[0].value = data.entityColumns[1];
        this.configEdit.select[0].selected = data.entityColumns[2];
        this.configEdit.id = data.entity_id;
        this.configEdit.select[0].selectItem = [];
        this.facultiesNamesIDs.forEach(item => {
            this.configEdit.select[0].selectItem.push(item.name);
        });
        this.configEdit.select[1].selected = data.entityColumns[3];
        this.configEdit.select[1].selectItem = [];
        this.specialitiesNamesIDs.forEach(item => {
            this.configEdit.select[1].selectItem.push(item.name);
        });
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                this.substituteSpecialitiesNamesOnId(data);
                this.substituteFacultiesNamesOnId(data);
                let newGroup: Group = new Group(data.list[0].value,
                                                data.select[0].selected,
                                                data.select[1].selected);
                this.crudService.updateData(this.entity, data.id, newGroup)
                    .subscribe(response => {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, () => {
                return;
            });
    }

    deleteCase(data: any) {
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати ${data.entityColumns[1]}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.delRecord(this.entity, data.entity_id);
            }, () => {
                return;
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

