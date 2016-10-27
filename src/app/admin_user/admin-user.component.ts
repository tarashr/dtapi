import {Component,OnInit} from '@angular/core';
import {Router} from "@angular/router";
import '../shared/rxjs-operators';

import {User} from '../shared/classes/user';
import {CRUDService} from "../shared/services/crud.service.ts";

@Component({
    templateUrl: 'admin-user.component.html',
    styleUrls: ['admin-user.component.css']
})
export class AdminUserComponent implements OnInit {

    public title: string = 'Адміністратори';
    public createTitle = 'Додати адміністратора';
    public editTitle = 'Редагувати дані адміністратора';
    public entity: string = 'AdminUser';
    public adminUsers: User[];
    public errorMessage: string;
    private countOfAdminUsers:number;
    public create = 'create';
    public edit = 'edit';
    public limit:number = 5;
    public currentPage:number = 1;
    public offset:number = 0;
    public maxSize: number = 5;

    
    constructor(private adminUserService: CRUDService,
                private _router: Router){}

    ngOnInit(): void {
        this.getCountRecords();
    }


    getCountRecords() {
        this.adminUserService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.countOfAdminUsers = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>console.log("error: ", error)
            );
    }

    getRecordsRange() {
        this.adminUserService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => this.adminUsers = data,
                error => this.errorMessage = <any>error
            );
    }

    changeLimit($event) {
        this.limit = $event.target.value;
        console.log(this.limit);
        this.offset = 0;
        this.currentPage = 1;
        this.getRecordsRange();
    }

    pageChange(num:number) {
        if (!num) {
            this.currentPage = 1;
            return;
        }
        this.currentPage = num;
        this.offset = (this.currentPage - 1) * this.limit;
        this.getRecordsRange();
    }

    delRecord(entity:string, id:number) {
        this.offset = (this.currentPage - 1) * this.limit;
        this.adminUserService.delRecord(entity, id)
            .subscribe(()=>this.refreshData("true"));
    }

    refreshData(data:string) {
        if (this.adminUsers.length === 1) {
            this.offset = (this.currentPage - 2) * this.limit;
            this.currentPage -= 1;
        } else if (this.adminUsers.length > 1) {
            this.offset = (this.currentPage - 1) * this.limit;
        }

        this.adminUserService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.countOfAdminUsers = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>console.log(error)
            );

    }
}