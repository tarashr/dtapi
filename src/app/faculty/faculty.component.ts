import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Faculty} from "../shared/classes/faculty";
import {CommonService} from "../shared/services/common.service";

@Component({
    templateUrl: 'faculty.component.html',
    styleUrls: ['faculty.component.css'],
    providers: [CommonService]
})
export class FacultyComponent implements OnInit {

    public faculties:Faculty[];
    private countOfFaculties:number;
    public entity:string = "faculty";
    public limit:number = 5;
    private findResultFaculties:Faculty[];
    public searchData:string = "";
    public page:number = 1;
    private offset:number = (this.page - 1) * this.limit;

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
        let userRole:string = localStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this._router.navigate(["/login"]);
        }
        this.getRecordsRange();
        this.getCountRecords();
    }

    getCountRecords() {
        this._commonService.getCountRecords(this.entity)
            .then(data => this.countOfFaculties = data.numberOfRecords);
    }

    getRecordsRange():void {
        this._commonService.getRecordsRange(this.entity, this.limit, this.offset)
            .then(data => this.faculties = data)
            .catch(error=> {
                if (error.response === "Only logged users can work with entities") {
                    this._router.navigate(["/login"])
                }
            });
    }

    delRecord(entity:string, id:number) {
        this.offset -= this.limit;
        this._commonService.delRecord(entity, id)
            .then(()=>this.getRecordsRange());
    }

    changeLimit() {
        this.offset = 0;
        this.page = 1;
        setTimeout(()=> {
            this._commonService.getRecordsRange(this.entity, this.limit, this.offset)
                .then(data => this.faculties = data);
        }, 0);
    }

    findEntity() {
        setTimeout(()=> {
            // if (this.searchData.length === 1) {
            //     this.getCountRecords();
            //     return;
            // }
            if (this.searchData.length === 0) {
                this.offset = 0;
                this.page = 1;
                this.getCountRecords();
                this.getRecordsRange();
                return;
            }

            this._commonService.getRecords(this.entity)
                .then(data => {
                    this.findResultFaculties = data.filter((faculty)=> {
                        if (faculty.faculty_name.toLowerCase().indexOf(this.searchData.toLowerCase()) === -1) {
                            return false
                        }
                        else {
                            return true
                        }
                    });
                    this.countOfFaculties = this.findResultFaculties.length;
                    this.faculties = this.findResultFaculties;
                })
                .catch(error=> {
                    if (error.response === "Only logged users can work with entities") {
                        this._router.navigate(["/login"])
                    }
                });

        }, 0);
    }

    refreshData(data:string) {
        this.offset -= this.limit;
        this.getRecordsRange();
    }

    pageChange(num:number) {
        this.page = num;
        this.offset = (this.page - 1) * this.limit;
        this.getRecordsRange();
    }
}