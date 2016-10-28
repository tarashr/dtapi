import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import '../shared/rxjs-operators';

import {Speciality} from '../shared/classes/speciality';
import {CRUDService} from "../shared/services/crud.service";


@Component({
    templateUrl:'speciality.component.html',
    styleUrls:['speciality.component.css']
})
export class SpecialityComponent implements OnInit{

    public title: string = "Спеціальності";
    public createTitle = "Додати спеціальність";
    public editTitle = "Редагувати спеціальність";
    public entity: string = "speciality";
    private countOfSpecialities: number;
    public specialities: Speciality[];
    public errorMessage: string;
    public create = "create";
    public edit = "edit";
    public limit: number = 5;
    public currentPage: number = 1;
    public offset: number = 0;
    public maxSize: number = 5;

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

}