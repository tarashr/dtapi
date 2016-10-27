import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Faculty} from "../shared/classes/faculty";
import {CRUDService} from "../shared/services/crud.service.ts";
import {configAddFaculty, configEditFaculty, maxSize} from "../shared/constants"

@Component({
    templateUrl: 'faculty.component.html',
    styleUrls: ['faculty.component.css']
})
export class FacultyComponent implements OnInit {

    public configAdd = configAddFaculty;
    public configEdit = configEditFaculty;
    public paginationSize = maxSize;

    public faculties:Faculty[];
    private countOfFaculties:number;
    public entity:string = "faculty";
    public limit:number = 5;
    private findResultFaculties:Faculty[];
    public search:string = "";
    public page:number = 1;
    public offset:number = 0;

    constructor(private _commonService:CRUDService,
                private _router:Router) {
    }

    ngOnInit() {
        this.getCountRecords();
        console.log("maxSize ", this.paginationSize)
    }

    activate(data:any) {
        if (data.action === "create") {
            let newFaculty:Faculty = new Faculty(data.list[0].value, data.list[1].value);
            this._commonService.insertData(this.entity, newFaculty)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        } else if (data.action === "edit") {
            let editedFaculty:Faculty = new Faculty(data.list[0].value, data.list[1].value);
            this._commonService.updateData(this.entity, data.id, editedFaculty)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        }
    }

    getCountRecords() {
        this._commonService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.countOfFaculties = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>console.log("error: ", error)
            );
    }

    getRecordsRange() {
        this._commonService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => this.faculties = data,
                error=> console.log("error: ", error))
    }

    delRecord(entity:string, id:number) {
        this.offset = (this.page - 1) * this.limit;
        this._commonService.delRecord(entity, id)
            .subscribe(()=>this.refreshData("delete"));
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
                    this.faculties = [];
                    return;
                }
                this.page = 1;
                this.faculties = data;
            }, error=>console.log("error: ", error));
    }

    refreshData(action:string) {

        if (action === "delete" && this.faculties.length === 1 && this.countOfFaculties > 1) {
            this.offset = (this.page - 2) * this.limit;
            this.page -= 1;
        } else if (this.faculties.length > 1) {
            this.offset = (this.page - 1) * this.limit;
        }

        this._commonService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.countOfFaculties = +data.numberOfRecords;
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