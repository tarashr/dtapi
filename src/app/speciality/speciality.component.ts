import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {ModalAddEditComponent} from "../shared/components/addeditmodal/modal-add-edit.component";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {Speciality} from '../shared/classes/speciality';
import {CRUDService} from "../shared/services/crud.service";
import {
    configAddSpeciality,
    configEditSpeciality,
    maxSize,
    changeLimit,
    pageChange,
    getCountRecords,
    getRecordsRange,
    delRecord,
    // findEntity,
    refreshData,
    successEventModal
} from "../shared/constants";
import {
    headersSpeciality,
    actionsSpeciality
} from "../shared/constant-config"

@Component({
    templateUrl:'speciality.component.html',
    styleUrls:['speciality.component.css']
})
export class SpecialityComponent implements OnInit{

    public modalInfoConfig = {
        title: "",
        infoString: "",
        action: ""
    };

    public configAdd = configAddSpeciality;
    public configEdit = configEditSpeciality;
    public paginationSize = maxSize;
    public headers: any = headersSpeciality;
    public actions: any = actionsSpeciality;


    public addTitle: string = "Створити новий факультет";
    public searchTitle:string = "Введіть дані для пошуку";
    public entityTitle:string = "Спеціальності";
    public selectLimit: string = "Виберіть кількість записів на сторінці";

    public entityData: any[] = [];
    private entityDataLength: number;
    public entity: string = "speciality";
    public limit: number = 5;
    public offset: number = 0;
    public page: number = 1;
    public searchCriteria: string = "";

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

    ngOnInit(){
        this.getCountRecords();
    }

    private createTableConfig = (data: any)=> {
        let tempArr: any[] = [];
        data.forEach((item)=> {
            let speciality: any = {};
            speciality.entity_id = item.speciality_id;
            speciality.entityColumns = [item.speciality_code, item.speciality_name];
            tempArr.push(speciality);
        });
        this.entityData = tempArr;
    };

    getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    this.createTableConfig(data);
                },
                error=> console.log("error: ", error))
    };


    findEntity(searchTerm: string) {
        this.searchCriteria = searchTerm;
        if (this.searchCriteria.length === 0) {
            this.offset = 0;
            this.page = 1;
            this.getCountRecords();
            return;
        }

        this.crudService.getRecordsBySearch(this.entity, this.searchCriteria)
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
                let newSpeciality: Speciality = new Speciality(data.list[0].value, data.list[1].value);
                this.crudService.insertData(this.entity, newSpeciality)
                    .subscribe(response=> {
                        this.configAdd.list.forEach((item)=>{item.value=""});
                        this.modalInfoConfig.infoString = `${data.list[0].value} успішно створено`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, ()=> {
                return
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
                let editedSpeciality: Speciality = new Speciality(data.list[0].value, data.list[1].value);
                this.crudService.updateData(this.entity, data.id, editedSpeciality)
                    .subscribe(response=> {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, ()=> {
                return
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