import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Student} from "../shared/classes/student";
import {CRUDService} from "../shared/services/crud.service";

@Component({
    templateUrl: 'student-new-profile.component.html',
    styleUrls: ['student-new-profile.component.css'],
})
export class StudentNewProfileComponent implements OnInit {

    public students:Student[];
    private countOfStudents:number;
    public entity:string = "student";
    public limit:number = 5;
    private findResultStudents:Student[];
    public searchData:string = "";
    public page:number = 1;
    private offset:number = 0;

    constructor(private _router:Router,
                private route:ActivatedRoute,
                private _commonService:CRUDService) {
    }

    ngOnInit() {
        let userRole: string = sessionStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this._router.navigate(["/login"]);
        }
    }

    /*ngOnInit() {
        let userRole:string = sessionStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this._router.navigate(["/login"]);
        }
        this.countOfStudents = Number(localStorage.getItem(this.entity));
        this.getRecordsRange();
    }
/*
    getCountRecords() {
        this._commonService.getCountRecords(this.entity)
            .subscribe(
                data => this.countOfStudents = data.numberOfRecords,
                error=>console.log(error)
            );
    }

    getRecordsRange() {
        this._commonService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => this.students = data,
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
                .subscribe(data => this.students = data);
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
                    this.findResultStudents = data.filter((student)=> {
                        // return ~student.student_name.toLowerCase().indexOf(this.searchData.toLowerCase());
                        if (student.student_name.toLowerCase().indexOf(this.searchData.toLowerCase()) === -1) {
                            return false
                        }
                        else {
                            return true
                        }
                    });
                    this.page = 1;
                    this.countOfStudents = this.findResultStudents.length;
                    this.students = this.findResultStudents;
                },error=> {
                    if (error.response === "Only logged users can work with entities") {
                        this._router.navigate(["/login"])
                    }
                });

        }, 0);
    }

    refreshData(data:string) {
        this.offset = (this.page - 1) * this.limit;
        this.getRecordsRange();
    }

    pageChange(num:number) {
        this.page = num;
        this.offset = (this.page - 1) * this.limit;
        this.getRecordsRange();
    }*/
}