import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Student} from "../shared/classes/student";
import {Group} from "../shared/classes/group";
import {CRUDService} from "../shared/services/crud.service.ts";
import {EntityManagerBody} from "../shared/classes/entity-manager-body";
/*import {baseUrl, entities}         from "../shared/constants.ts";
 import {StudentService} from "../shared/services/student.service.ts";
 import {Observable} from 'rxjs';*/
import '../shared/rxjs-operators';
import {
    maxSize,
    pageChange,
    delRecord,
    //findEntity,
    refreshData,
    getCountRecords,
    // getRecordsRange,
    // changeLimit
} from "../shared/constants"

export const changeLimit = function (limit: number): void {
    this.limit = limit;
    this.offset = 0;
    this.page = 1;
    this.getRecordsRange();
};

@Component({
    templateUrl: 'student.component.html',
    styleUrls: ['student.component.css']
})

export class StudentComponent implements OnInit {

    public paginationSize = maxSize;

    //constants for view
    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Студенти";
    public selectLimit: string = "Виберіть кількість студентів на сторінці";
    //

    public entityData: any[] = [];
    private entityDataLength: number;
    public entityData2: Student[];
    public entity: string = "student";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;

    public groupEntity: string = "Group";
    public groups: Group[] = [];

    headers = [
        {name: "№", style: "col-xs-12 col-sm-1"},
        {name: "ПІБ", style: "col-xs-12 col-sm-3"},
        {name: "№ залікової книжки", style: "col-xs-12 col-sm-3"},
        {name: "Група", style: "col-xs-12 col-sm-3"},
        {name: "", style: "col-xs-12 col-sm-2"}
    ];

    actions = [
        {title: "Профіль студента", action: "edit", style: "glyphicon glyphicon-user"},
        {title: "Видалити студента", action: "delete", style: "glyphicon glyphicon-trash"}
    ];

    constructor(private crudService: CRUDService,
                private _router: Router) {
    }

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public delRecord = delRecord;
    //public findEntity = findEntity;
    public errorMessage: string;
    //public refreshData = refreshData;
    public getCountRecords = getCountRecords;
    // public getRecordsRange = getRecordsRange;

    ngOnInit() {
        this.getCountRecords();
    }

    /*getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    this.entityData = data;
                    this.getGroupName();
                },
                error=> console.log("error: ", error))
    };*/

    getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    this.entityData2 = data;
                    this.getGroupName();

                    let tempArr: any[] = [];
                    data.forEach((item)=> {
                        let student: any = {};
                        student.entity_id = item.user_id;
                        student.entityColumns = [(item.student_surname+" "+item.student_name+" "+item.student_fname), item.gradebook_id, item.group_name];
                        //console.log("student.entityColumns");
                        //console.log(student.entityColumns);
                        student.actions = this.actions;
                        tempArr.push(student);
                    });
                    this.entityData = tempArr;

                    let len:number = this.entityData.length;
                    for (let i=0; i< len; i++){
                        console.log("this.entityData :");
                        console.log(this.entityData[i]);
                        console.log(this.entityData[i].entityColumns[2]);
                        console.log("this.entityData2 :");
                        console.log(this.entityData2[i]);
                        console.log(this.entityData2[i].user_id,this.entityData2[i].student_name,"groupname: ",this.entityData2[i].group_name);
                        /*this.entityData[i].entityColumns.push(this.entityData2[i].group_name);
                        console.log(this.entityData[i].entityColumns.group_name);
                        console.log("this.entityData2[i] : ");
                        console.log(this.entityData2[i]);*/
                    }

                    console.log("entityData = tempArr : ");
                    console.log(this.entityData);
                },
                error=> console.log("error: ", error))
    };



   /* getCountRecords() {
        this.crudService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.entityDataLength = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>console.log("error: ", error)
            );
    };*/

    getGroupName(): void {
        let groupId: number[] = [];
        /*console.log("DataEntity2 : ");
        console.log(this.entityData2);*/
        let data = this.entityData2;
        /*console.log("Data2 : ");
        console.log(data);*/

        for (let i in data) {
            groupId.push(data[i].group_id);
        }

        /*console.log("GroupId : ");
        console.log(groupId);
        console.log("Data2 in the loop: " );
        console.log(data);*/
        let dataEnt = new EntityManagerBody(this.groupEntity, groupId);
        this.crudService.getEntityValues(dataEnt)
            .subscribe(
                groups => {
                    this.groups = groups;
                    for (let j in this.entityData2)
                        for (let i in this.groups) {
                            if (this.entityData2[j].group_id == this.groups[i].group_id) {
                                this.entityData2[j].group_name = this.groups[i].group_name;
                            }
                        }
                    //console.log(this.entityData2);
                },
                error => this.errorMessage = <any>error
            );
    }

    findEntity(searchTerm: string) {
        this.search = searchTerm;
        if (this.search.length === 0) {
            this.offset = 0;
            this.page = 1;
            this.getCountRecords();
            return;
        }

        this.crudService.getRecordsBySearch(this.entity, this.search)
            .subscribe(data => {
                if (data.response == "no records") {
                    this.entityData = [];
                    return;
                }
                this.page = 1;
                let tempArr: any[] = [];
                data.forEach((item)=> {
                    let student: any = {};
                    student.entity_id = item.student_id;
                    student.entityColumns = [(item.student_surname + " " + item.student_name + " " + item.student_fname), item.gradebook_id, item.group_name];
                    student.actions = this.actions;
                    tempArr.push(student);
                });
                this.entityData = tempArr;
            }, error=>console.log("error: ", error));
    };

    activate(data: any) {
        console.log("!!! ", data);
        switch (data.action) {
            case "edit":
                console.log("we will edit ", data.entityColumns[0] + " with id: " + data.entity_id);
                break;
            case "delete":
                console.log("we will delete ", data.entityColumns[0] + " with id: " + data.entity_id);
                this.delRecord(this.entity, data.entity_id);
                break;
        }
    }

    refreshData(action: string) {
        if (action === "delete" && this.entityData.length === 1 && this.entityDataLength > 1) {
            this.offset = (this.page - 2) * this.limit;
            this.page -= 1;
        } else if (this.entityData.length > 1) {
            this.offset = (this.page - 1) * this.limit;
        }

        this.crudService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.entityDataLength = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>console.log(error)
            );
    }

}