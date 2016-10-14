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
    private offset:number = 0;

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

    getRecordsRange():void {
        this._commonService.getRecordsRange(this.entity, this.limit, this.offset)
            .then(data => this.faculties = data)
            .catch(error=> {
                if (error.response === "Only logged users can work with entities") {
                    this._router.navigate(["/login"])
                }
            });
        this.offset += this.limit;
    }

    delRecord(entity:string, id:number) {
        this.offset -= this.limit;
        this._commonService.delRecord(entity, id)
            .then(()=>this.getRecordsRange());
    }

    changeLimit() {
        this.offset = 0;
        setTimeout(()=> {
            this._commonService.getRecordsRange(this.entity, this.limit, this.offset)
                .then(data => this.faculties = data);
            this.offset += this.limit;
        }, 0);

    }

    ngOnInit() {
        let userRole:string = localStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this._router.navigate(["/login"]);
        }
        this.getRecordsRange();
        this._commonService.getCountRecords(this.entity)
            .then(data => this.countOfFaculties = data);

    }
}