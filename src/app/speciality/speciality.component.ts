import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import '../shared/rxjs-operators';

import {Speciality} from '../shared/classes/speciality';
import {CRUDService} from "../shared/services/crud.service";
import { configAddSpeciality, configEditSpeciality } from '../shared/constants';


@Component({
    templateUrl:'speciality.component.html',
    styleUrls:['speciality.component.css']
})
export class SpecialityComponent implements OnInit{

    public title: string = "Спеціальності";
    public entity: string = "speciality";
    private countOfSpecialities: number;
    public specialities: Speciality[];
    public errorMessage: string;
    public limit: number = 5;
    public currentPage: number = 1;
    public offset: number = 0;
    public maxSize: number = 5;

    //varibles for addedit
    public configAddSpeciality = configAddSpeciality;
    public configEditSpeciality = configEditSpeciality;

    constructor(private crudService: CRUDService,
                private _router: Router) {}


    ngOnInit(){
        this.getCountRecords();
    }

    getCountRecords() {
        this.crudService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.countOfSpecialities = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>console.log("error: ", error)
            );
    }

    getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => this.specialities = data,
                error => this.errorMessage = <any>error
            );
    }

    changeLimit($event) {
        this.limit = $event.target.value;
        this.offset = 0;
        this.currentPage = 1;
        this.getRecordsRange();
    }

    pageChange(num:number) {
        if (!num) {
            this.currentPage = 1;
            return;
        }
        this.currentPage = num;
        this.offset = (this.currentPage - 1) * this.limit;
        this.getRecordsRange();
    }

    delRecord(entity:string, id:number) {
        this.offset = (this.currentPage - 1) * this.limit;
        this.crudService.delRecord(entity, id)
            .subscribe(()=>this.refreshData("true"));
    }

    refreshData(data:string) {
        if (this.specialities.length === 1) {
            this.offset = (this.currentPage - 2) * this.limit;
            this.currentPage -= 1;
        } else if (this.specialities.length > 1) {
            this.offset = (this.currentPage - 1) * this.limit;
        }

        this.crudService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.countOfSpecialities = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>console.log(error)
            );

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