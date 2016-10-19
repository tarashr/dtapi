import {Component,OnInit} from '@angular/core';
import '../shared/rxjs-operators';

import {User} from '../shared/classes/user';
import {AdminUserService} from '../shared/services/adminUser.service'

@Component({
    templateUrl: 'admin-user.component.html',
    styleUrls: ['admin-user.component.css']
})
export class AdminUserComponent implements OnInit {

    title: string = 'Адміністратори';
    public adminUsers: User[];
    errorMessage: string;

    constructor(private adminUserService: AdminUserService){}

    ngOnInit(): void {
        this.getAdminUsers();
    }

    getAdminUsers():void {
        this.adminUserService.getAdminUsers()
            .subscribe(
                adminUsers => this.adminUsers = adminUsers,
                error => this.errorMessage = <any>error
            );
    }

    deleteAdminUser(adminUser: User): void {
        if (confirm('Видалити адміністратора?')) {
            this.adminUserService
                .deleteAdminUser(adminUser.user_id)
                .subscribe(
                    data => {
                        this.getAdminUsers();
                        return true;
                    },
                    error => this.errorMessage = <any>error
                );
        }
    }
}