import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Student} from "../shared/classes/student";
import {CommonService} from "../shared/services/common.service";

@Component({
    templateUrl: 'student.component.html',
    styleUrls: ['student.component.css'],
    providers: [CommonService]
})
export class StudentComponent implements OnInit {

    public students:Student[];
    private countOfStudents:number;
    public entity:string = "student";
    public limit:number = 5;
    private findResultStudents:Student[];
    public searchData:string = "";
    public page:number = 1;
    private offset:number = 0;

    constructor(private _commonService:CommonService,
                private _router:Router) {
    }

    ngOnInit() {
        let userRole:string = sessionStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this._router.navigate(["/login"]);
        }
        this.countOfStudents = Number(localStorage.getItem(this.entity));
        this.getRecordsRange();
    }

    getCountRecords() {
        this._commonService.getCountRecords(this.entity)
            .then(data => this.countOfStudents = data.numberOfRecords);
    }

    getRecordsRange() {
        this._commonService.getRecordsRange(this.entity, this.limit, this.offset)
            .then(data => this.students = data)
            .catch(error=> {
                if (error.response === "Only logged users can work with entities") {
                    this._router.navigate(["/login"])
                }
            });
    }

    delRecord(entity:string, id:number) {
        this.offset = (this.page - 1) * this.limit;
        this._commonService.delRecord(entity, id)
            .then(()=>this.getRecordsRange());
    }

    changeLimit() {
        this.offset = 0;
        this.page = 1;
        setTimeout(()=> {
            this._commonService.getRecordsRange(this.entity, this.limit, this.offset)
                .then(data => this.students = data);
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
                .then(data => {
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
                })
                .catch(error=> {
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
    }
}