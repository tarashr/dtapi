import {Component,OnInit} from '@angular/core';
import '../shared/rxjs-operators';

import {User} from '../shared/classes/user';
import {CommonService} from "../shared/services/common.service";

@Component({
    templateUrl: 'admin-user.component.html',
    styleUrls: ['admin-user.component.css']
})
export class AdminUserComponent implements OnInit {

    title: string = 'Адміністратори';
    public entity: string = 'AdminUser';
    public adminUsers: User[];
    errorMessage: string;
    
    constructor(private adminUserService: CommonService){}

    ngOnInit(): void {
        this.getRecords();
    }

    getRecords():void {
        this.adminUserService.getRecords(this.entity)
            .subscribe(
                adminUsers => this.adminUsers = adminUsers,
                error => this.errorMessage = <any>error
            );
    }

    deleteAdminUser(entity:string, id:number) : void {
        if (confirm('Видалити адміністратора?')) {
            this.adminUserService
                .delRecord(entity, id)
                .subscribe(
                    ()=>this.getRecords(),
                    error => this.errorMessage = <any>error
                );
        }
    }
}