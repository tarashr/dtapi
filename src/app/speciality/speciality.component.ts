import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {Speciality} from '../shared/classes/speciality';
import {CRUDService} from "../shared/services/crud.service";
import {
    configAddSpeciality,
    configEditSpeciality,
    maxSize,
    pageChange,
    getCountRecords,
    delRecord
} from "../shared/constants"

@Component({
    templateUrl:'speciality.component.html',
    styleUrls:['speciality.component.css']
})
export class SpecialityComponent implements OnInit{

    public configAdd = configAddSpeciality;
    public configEdit = configEditSpeciality;
    public paginationSize = maxSize;


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

    headers = [
        {name: "№", style: "col-xs-12 col-sm-1"},
        {name: "Код спеціальності", style: "col-xs-12 col-sm-4"},
        {name: "Назва спеціальності", style: "col-xs-12 col-sm-4"},
        {name: "", style: "col-xs-12 col-sm-3"}
    ];

    actions = [
        {title: "Перейти до груп спеціальності", action: "group", style: "glyphicon glyphicon-th"},
        {title: "Редагувати спеціальність", action: "edit", style: "glyphicon glyphicon-edit"},
        {title: "Видалити спеціальність", action: "delete", style: "glyphicon glyphicon-trash"}
    ];


    constructor(private crudService: CRUDService,
                private _router: Router) {};


    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public delRecord = delRecord;

    ngOnInit(){
        this.getCountRecords();
    }

    changeLimit(limit:number): void {
        this.limit = limit;
        this.offset = 0;
        this.page = 1;
        this.getRecordsRange();
    };

    getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    let tempArr: any[] = [];
                    data.forEach((item)=> {
                        let speciality: any = {};
                        speciality.entity_id = item.speciality_id;
                        speciality.entityColumns = [item.speciality_code, item.speciality_name];
                        speciality.actions = this.actions;
                        tempArr.push(speciality);
                    });
                    this.entityData = tempArr;
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
                let tempArr: any[] = [];
                data.forEach((item)=> {
                    let speciality: any = {};
                    speciality.entity_id = item.speciality_id;
                    speciality.entityColumns = [item.speciality_code, item.speciality_name];
                    speciality.actions = this.actions;
                    tempArr.push(speciality);
                });
                this.entityData = tempArr;
            }, error=>console.log("error: ", error));
    };

    activate(data: any) {
        console.log("!!! ", data);
        switch (data.action) {
            case "group":
                this._router.navigate(["/admin/faculty", data.entity_id, "groups"]);
                break;
            case "edit":
                console.log("we will edit ", data.entityColumns[0] + " with id: " + data.entity_id);
                break;
            case "delete":
                console.log("we will delete ", data.entityColumns[0] + " with id: " + data.entity_id);
                this.delRecord(this.entity, data.entity_id);
                break;
        }
    }

    modalAdd(data: any) {
        if (data.action === "create") {
            let newSpeciality: Speciality = new Speciality(data.list[0].value, data.list[1].value);
            this.crudService.insertData(this.entity, newSpeciality)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        } else if (data.action === "edit") {
            let editedSpeciality: Speciality = new Speciality(data.list[0].value, data.list[1].value);
            this.crudService.updateData(this.entity, data.id, editedSpeciality)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        }
    }

    refreshData(action: string) {
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
                error=>console.log(error)
            );
    }

}