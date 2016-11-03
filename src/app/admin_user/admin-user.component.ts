import {Component,OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {User} from '../shared/classes/user';
import {CRUDService} from "../shared/services/crud.service.ts";
import {
    configAddAdminUser,
    configEditFaculty,
    maxSize,
    // changeLimit,
    pageChange,
    getCountRecords,
    getRecordsRange,
    delRecord,
    // findEntity,
    refreshData
} from "../shared/constants"

export const changeLimit = function (limit:number):void {
    this.limit = limit;
    this.offset = 0;
    this.page = 1;
    this.getRecordsRange();
};

@Component({
    templateUrl: 'admin-user.component.html',
    styleUrls: ['admin-user.component.css']
})
export class AdminUserComponent implements OnInit {

    public configAdd = configAddAdminUser;
    public configEdit = configEditFaculty;
    public paginationSize = maxSize;

    //constants for view
    public searchTitle:string = "Введіть дані для пошуку";
    public entityTitle:string = "Адміністратори";
    public selectLimit: string = "Виберіть кількість записів на сторінці";
    //

    public entityData: any[] = [];
    private entityDataLength: number;
    public entity: string = "AdminUser";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;

    headers = [
        {name: "№", style: "col-xs-12 col-sm-1"},
        {name: "Логін", style: "col-xs-12 col-sm-4"},
        {name: "Поштова скринька", style: "col-xs-12 col-sm-4"},
        {name: "", style: "col-xs-12 col-sm-3"}
    ];

    actions = [
        {title: "Редагувати факультет", action: "edit", style: "glyphicon glyphicon-edit"},
        {title: "Видалити факультет", action: "delete", style: "glyphicon glyphicon-trash"}
    ];

    // public title: string = "Адміністратори";
    // public createTitle = "Додати адміністратора";
    // public editTitle = "Редагувати дані адміністратора";
    // public adminUsers: User[];
    // public errorMessage: string;
    // private countOfAdminUsers:number;
    // public create = "create";
    // public edit = "edit";
    //
    //
    //
    // public maxSize: number = 5;

    
    constructor(private crudService: CRUDService,
                private _router: Router) {}

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public delRecord = delRecord;


    ngOnInit(): void {
        this.getCountRecords();
    }

    getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    let tempArr: any[] = [];
                    data.forEach((item)=> {
                        let adminUser: any = {};
                        adminUser.entity_id = item.id;
                        adminUser.entityColumns = [item.username, item.email];
                        adminUser.actions = this.actions;
                        tempArr.push(adminUser);
                    });
                    this.entityData = tempArr;
                },
                error=> console.log("error: ", error))
    };

    activate(data: any) {
        console.log("!!! ", data);
        switch (data.action) {
            case "group":
                this._router.navigate(["/admin/faculty", data.entity_id, "groups"]);
                break;
            case "edit":
                console.log("we will edit ", data.entityColumns[0] + " with id: " + data.entity_id);
                break;
            case "delete":
                console.log("we will delete ", data.entityColumns[0] + " with id: " + data.entity_id);
                this.delRecord(this.entity, data.entity_id);
                break;
        }
    }

    modalAdd(data: any) {
        if (data.action === "create") {
            let newAdminUser: User = new User(data.list[0].value, data.list[1].value, data.list[2].value);
            this.crudService.insertData(this.entity, newAdminUser)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        } else if (data.action === "edit") {
            let editedAdminUser: User = new User(data.list[0].value, data.list[1].value, data.list[2].value);
            this.crudService.updateData(this.entity, data.id, editedAdminUser)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        }
    }

    refreshData(action:string) {
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