import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {Group} from '../shared/classes/group';
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
    successEventModal
} from "../shared/constants";
import {
    headersGroup,
    actionsGroup
} from "../shared/constant-config"

@Component({
    templateUrl: 'group.component.html',
    styleUrls: ['group.component.css']
})
export class GroupComponent implements OnInit {

    public modalInfoConfig = {
        title: "",
        infoString: "",
        action: ""
    };

    public configAdd = configAddGroup;
    public configEdit = configEditGroup;
    public paginationSize = maxSize;
    public headers: any = headersGroup;
    public actions: any = actionsGroup;

    //constants for view
    public addTitle: string = "Створити нову групу";
    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Групи";
    public selectLimit: string = "Виберіть кількість записів на сторінці";
    //

    public entityData: any[] = [];
    private entityDataLength: number;
    public entityData2: Group[];
    public entity: string = "group";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;

    public facultyEntity: string = "Faculty";
    public faculties: Faculty[] = [];
    public specialityEntity: string = "Speciality";
    public specialities: Speciality[] = [];

    public facultiesNames: string[] = [];
    public specialitiesNames: string[] = [];

    constructor(private crudService: CRUDService,
                private _router: Router,
                private modalService: NgbModal) {
    };

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public delRecord = delRecord;
    public refreshData = refreshData;
    public successEventModal = successEventModal;

    ngOnInit() {
        this.getCountRecords();
        this.getFacultiesList();
        this.getSpecialityList()
    }

    private createTableConfig = (data: any)=> {
        let tempArr: any[] = [];
        data.forEach((item)=> {
            let group: any = {};
            group.entity_id = item.group_id;
            group.entityColumns = [item.group_name, item.faculty_name, item.speciality_name];
            tempArr.push(group);
        });
        this.entityData = tempArr;
    };

    getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    this.entityData2 =  data;
                    this.getFacultyName();
                },
                error=> console.log("error: ", error))
    };

    getFacultiesList() {
        this.crudService.getRecords("Faculty")
            .subscribe(
                data => {
                    for(let i = 0 ; i < data.length; i++) {
                        this.facultiesNames.push(data[i].faculty_name);
                    }
                },
                error=> console.log("error: ", error))
    };

    getSpecialityList() {
        this.crudService.getRecords("Speciality")
            .subscribe(
                data => {
                    for(let i = 0 ; i < data.length; i++) {
                        this.specialitiesNames.push(data[i].speciality_name);
                    }
                },
                error=> console.log("error: ", error))
    };

    getFacultyName(): void {
        let facultyId: number[] = [];
        let data2 = this.entityData2;
        for(let i in data2) {
            facultyId.push(data2[i].faculty_id);
        }
        let facultyEntManObject = new EntityManagerBody(this.facultyEntity, facultyId);
        this.crudService.getEntityValues(facultyEntManObject)
            .subscribe(
                response => {
                    this.faculties = response;
                    for(let i in this.entityData2) {
                        for(let k in this.faculties) {
                            if (this.entityData2[i].faculty_id == this.faculties[k].faculty_id) {
                                this.entityData2[i].faculty_name = this.faculties[k].faculty_name;
                            }
                        }
                    }
                    this.getSpecialityName();
                },
                error => console.log("error: ", error)
            );
    }

    getSpecialityName(): void{
        let specialityId: number[] = [];
        let data2 = this.entityData2;
        for(let i in data2) {
            specialityId.push(data2[i].speciality_id);
        }
        let specialityEntManObject = new EntityManagerBody(this.specialityEntity, specialityId);
        this.crudService.getEntityValues(specialityEntManObject)
            .subscribe(
                response => {
                    this.specialities = response;
                    for(let i in this.entityData2) {
                        for(let k in this.specialities) {
                            if (this.entityData2[i].speciality_id == this.specialities[k].speciality_id) {
                                this.entityData2[i].speciality_name = this.specialities[k].speciality_name;
                            }
                        }
                    }
                    this.createTableConfig(this.entityData2);
                },
                error => console.log("error: ", error)
            );
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
                if (data.response == "no records") {
                    this.entityData = [];
                    return;
                }
                this.page = 1;
                this.createTableConfig(data);
            }, error=>console.log("error: ", error));
    };

    activate(data: any) {
        switch (data.action) {
            case "group":
                this._router.navigate(["/admin/faculty", data.entity_id, "groups"]);
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

    createCase() {
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                let newGroup: Group = new Group(data.list[0].value, data.list[1].value, data.list[2].value);
                this.crudService.insertData(this.entity, newGroup)
                    .subscribe(response=> {
                        this.modalInfoConfig.infoString = `${data.list[0].value} успішно створено`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, ()=> {
                return;
            });
    };

    editCase(data:any){
        this.configEdit.list.forEach((item, i)=> {
            item.value = data.entityColumns[i]
        });
        this.configEdit.id = data.entity_id;
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                let newGroup: Group = new Group(data.list[0].value, data.list[1].value, data.list[2].value);
                this.crudService.insertData(this.entity, newGroup)
                    .subscribe(response=> {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, ()=> {
                return;
            });
    }

    deleteCase(data:any){
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати ${data.entityColumns[0]}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.delRecord(this.entity, data.entity_id);
            }, ()=> {
                return
            });
    }
}

