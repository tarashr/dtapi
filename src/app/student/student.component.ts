import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Student} from "../shared/classes/student";
import {Group} from "../shared/classes/group";
import {CRUDService} from "../shared/services/crud.service.ts";
import {StudentService} from "../shared/services/student.service.ts";
import {EntityManagerBody} from "../shared/classes/entity-manager-body";
import {baseUrl, entities}         from "../shared/constants.ts";
import {Observable} from 'rxjs';
import '../shared/rxjs-operators';
import {
    maxSize,
    changeLimit,
    pageChange,
    getCountRecords,
    getRecordsRange,
    delRecord,
    findEntity,
    refreshData
} from "../shared/constants"

@Component({
    templateUrl: 'student.component.html',
    styleUrls: ['student.component.css'],
})

export class StudentComponent implements OnInit {

    public paginationSize = maxSize;

    public entityData: Student[];
    private entityDataLength: number;
    public entity: string = "student";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    private offset: number = 0;

    public groupEntity: string = "Group";
    public groups: Group[] = [];

    constructor(private crudService:CRUDService,
                private _router:Router) {
    }

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    /*public getCountRecords = getCountRecords;*/
    /*public getRecordsRange = getRecordsRange;*/
    public delRecord = delRecord;
    public findEntity = findEntity;
    public refreshData = refreshData;
    public errorMessage: string;

    ngOnInit() {
        this.getCountRecords();
    }

    getRecordsRange () {
    this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
        .subscribe(
            data => {
                this.entityData = data;
                this.getGroupName();
            },
            error=> console.log("error: ", error))
    };

    getCountRecords () {
        this.crudService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.entityDataLength = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>console.log("error: ", error)
            );
    };

    getGroupName(): void {
        let groupId: number[] = [];
        console.log("DataEntity : " + this.entityData);
        let data = this.entityData;
        console.log("Data : " + data);

        for (let i in data) {
            groupId.push(data[i].group_id);
        }

        console.log("GroupId : " + groupId);
        console.log("Data2 : " + data);

        let dataEnt = new EntityManagerBody(this.groupEntity, groupId);
        this.crudService.getEntityValues(dataEnt)
            .subscribe(
                groups => {
                    this.groups = groups;
                    for (let j in this.entityData)
                    for (let i in this.groups) {
                        if (this.entityData[j].group_id == this.groups[i].group_id) {this.entityData[j].group_name = this.groups[i].group_name;}
                    }
                    console.log(this.entityData);
                },
                error => this.errorMessage = <any>error
            );
    }

}