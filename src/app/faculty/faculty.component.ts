import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Faculty} from "../shared/classes/faculty";
import {CRUDService} from "../shared/services/crud.service.ts";
import {
    configAddFaculty,
    configEditFaculty,
    maxSize,
    // changeLimit,
    pageChange,
    getCountRecords,
    getRecordsRange,
    delRecord,
    // findEntity,
    refreshData
} from "../shared/constants"

export const changeLimit = function (limit:number):void {
    this.limit = limit;
    this.offset = 0;
    this.page = 1;
    this.getRecordsRange();
};

export const findEntity = function(search:string) {
    this.search = search;
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
            this.entityData = data;
        }, error=>console.log("error: ", error));
};

@Component({
    templateUrl: 'faculty.component.html',
    styleUrls: ['faculty.component.css']
})
export class FacultyComponent implements OnInit {

    public configAdd = configAddFaculty;
    public configEdit = configEditFaculty;
    public paginationSize = maxSize;

    //constants for view
    public groupsOfFaculty:string = "Переглянути групи факультету";
    public deleteFaculty:string = "Видалити факультет";
    public selectLimit:string = "Виберіть кількість факультетів на сторінці";
    public searchTitle:string = "Введіть дані для пошуку";
    public entityTitle:string = "Факультети";
    //

    public entityData:Faculty[];
    private entityDataLength:number;
    public entity:string = "faculty";
    public limit:number = 5;
    public search:string = "";
    public page:number = 1;
    public offset:number = 0;

    constructor(private crudService:CRUDService,
                private _router:Router) {
    };

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public getRecordsRange = getRecordsRange;
    public delRecord = delRecord;
    public findEntity = findEntity;
    public refreshData = refreshData;

    ngOnInit() {
        this.getCountRecords();
    }

    activate(data:any) {
        if (data.action === "create") {
            let newFaculty:Faculty = new Faculty(data.list[0].value, data.list[1].value);
            this.crudService.insertData(this.entity, newFaculty)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        } else if (data.action === "edit") {
            let editedFaculty:Faculty = new Faculty(data.list[0].value, data.list[1].value);
            this.crudService.updateData(this.entity, data.id, editedFaculty)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        }
    }
}