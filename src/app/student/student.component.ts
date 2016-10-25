import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Student} from "../shared/classes/student";
import {CommonService} from "../shared/services/common.service";

@Component({
    templateUrl: 'student.component.html',
    styleUrls: ['student.component.css'],
})
export class StudentComponent implements OnInit {

    public students:Student[];
    private countOfStudents:number;
    public entity:string = "student";
    public limit:number = 5;
    private findResultStudents:Student[];
    public search:string = "";
    public page:number = 1;
    private offset:number = 0;

    constructor(private _commonService:CommonService,
                private _router:Router) {
    }

    ngOnInit() {
        let userRole: string = sessionStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this._router.navigate(["/login"]);
        }

        this.getCountRecords();
    }

    getCountRecords() {
        this._commonService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.countOfStudents = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>console.log("error: ", error)
            );
    }

    getRecordsRange() {
        this._commonService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => this.students = data,
                error=> console.log("error: ", error))
    }

    delRecord(entity:string, id:number) {
        if (confirm("Підтвердіть видалення студента")){
            this.offset = (this.page - 1) * this.limit;
        this._commonService.delRecord(entity, id)
            .subscribe(()=>this.refreshData("true"));
    }
}

    changeLimit($event) {
        this.limit = $event.target.value;
        console.log(this.limit);
        this.offset = 0;
        this.page = 1;
        this.getRecordsRange();
    }

    findEntity($event) {
        this.search = $event.target.value;
        if (this.search.length === 0) {
            this.offset = 0;
            this.page = 1;
            this.getCountRecords();
            return;
        }

        this._commonService.getRecordsBySearch(this.entity, this.search)
            .subscribe(data => {
                if (data.response == "no records") {
                    this.students = [];
                    return;
                }
                this.page = 1;
                this.students = data;
            }, error=>console.log("error: ", error));
    }

    refreshData(data:string) {
        if (this.students.length === 1) {
            this.offset = (this.page - 2) * this.limit;
            this.page -= 1;
        } else if (this.students.length > 1) {
            this.offset = (this.page - 1) * this.limit;
        }

        this._commonService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.countOfStudents = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>console.log(error)
            );
    }

    pageChange(num:number) {
        if (!num) {
            this.page = 1;
            return;
        }
        this.page = num;
        this.offset = (this.page - 1) * this.limit;
        this.getRecordsRange();
    }
}