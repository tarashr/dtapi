import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import '../shared/rxjs-operators';

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
    findEntity,
    refreshData
} from "../shared/constants"


@Component({
    templateUrl:'speciality.component.html',
    styleUrls:['speciality.component.css']
})
export class SpecialityComponent implements OnInit{

    public title: string = "Спеціальності";
    public entity: string = "speciality";
    public entityDataLength: number;
    public errorMessage: string;
    public limit: number = 5;
    public page: number = 1;
    public search:string = "";
    public offset: number = 0;
    public paginationSize = maxSize;

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public getRecordsRange = getRecordsRange;
    public delRecord = delRecord;
    public findEntity = findEntity;
    public refreshData = refreshData;

    public configAddSpeciality = configAddSpeciality;
    public configEditSpeciality = configEditSpeciality;

    constructor(private crudService: CRUDService,
                private _router: Router) {}


    ngOnInit(){
        this.getCountRecords();
    }


    activate(data:any) {
        if (data.action === "create") {
            let newSpeciality: Speciality = new Speciality(data.list[0].value, data.list[1].value);
            this.crudService.insertData(this.entity, newSpeciality)
                .subscribe(
                    response => {
                        this.refreshData(data.action);
                    },
                    error => this.errorMessage = <any>error,
                );
        } else if (data.action === "edit") {
            let editedSpeciality: Speciality = new Speciality(data.list[0].value, data.list[1].value);
            this.crudService.updateData(this.entity, data.id, editedSpeciality)
                .subscribe(
                    (res) => {
                        this.refreshData(data.action);
                    },
                    error => this.errorMessage = <any>error
                );
        }
    }

}