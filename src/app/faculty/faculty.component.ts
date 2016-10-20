import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Faculty} from "../shared/classes/faculty";
import {CommonService} from "../shared/services/common.service";

@Component({
    templateUrl: 'faculty.component.html',
    styleUrls: ['faculty.component.css']
})
export class FacultyComponent implements OnInit {

    public faculties:Faculty[];
    private countOfFaculties:number;
    public entity:string = "faculty";
    public limit:number = 5;
    private findResultFaculties:Faculty[];
    public searchData:string = "";
    public page:number = 1;
    public offset:number = 1;

    //data for child NgbdModalBasic
    public titleForNew = "Створити факультет";
    public nameForNew:string = "";
    public descriptionForNew:string = "";
    public create = "create";
    public titleForEdit = 'Редагувати дані факультету';
    public nameForEdit:string;
    public descriptionForEdit:string;
    public idEdit:number;
    public edit = "edit";
    //end

    constructor(private _commonService:CommonService,
                private _router:Router) {
    }

    ngOnInit() {
        let userRole:string = sessionStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this._router.navigate(["/login"]);
        }
        this.countOfFaculties = Number(localStorage.getItem(this.entity));
        this.getRecordsRange();
    }

    getCountRecords() {
        this._commonService.getCountRecords(this.entity)
            .subscribe(
                data => this.countOfFaculties = data.numberOfRecords,
                error=>console.log(error)
            );
    }

    getRecordsRange() {
        this._commonService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => this.faculties = data,
                error=> {
                    if (error.response === "Only logged users can work with entities") {
                        this._router.navigate(["/login"])
                    }
                })

    }

    delRecord(entity:string, id:number) {
        this.offset = (this.page - 1) * this.limit;
        this._commonService.delRecord(entity, id)
            .subscribe(()=>this.getRecordsRange());
    }

    changeLimit() {
        this.offset = 0;
        this.page = 1;
        setTimeout(()=> {
            this._commonService.getRecordsRange(this.entity, this.limit, this.offset)
                .subscribe(data => this.faculties = data);
        }, 0);
    }

    findEntity() {
        setTimeout(()=> {
            if (this.searchData.length === 0) {
                this.offset = 0;
                this.page = 1;
                this.getCountRecords();
                this.getRecordsRange();
                return;
            }

            this._commonService.getRecords(this.entity)
                .subscribe(data => {
                    this.findResultFaculties = data.filter((faculty)=> {
                        // return ~faculty.faculty_name.toLowerCase().indexOf(this.searchData.toLowerCase());
                        if (faculty.faculty_name.toLowerCase().indexOf(this.searchData.toLowerCase()) === -1) {
                            return false
                        }
                        else {
                            return true
                        }
                    });
                    this.page = 1;
                    this.countOfFaculties = this.findResultFaculties.length;
                    this.faculties = this.findResultFaculties;
                },error=> {
                    if (error.response === "Only logged users can work with entities") {
                        this._router.navigate(["/login"])
                    }
                })
        }, 0);
    }

    refreshData(data:string) {
        this.offset = (this.page - 1) * this.limit;
        this.getRecordsRange();
    }

    pageChange(num:number) {
        console.log('in faculty');
        this.page = num;
        this.offset = (this.page - 1) * this.limit;
        this.getRecordsRange();
    }
}