import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {User} from '../../shared/classes/user';
<<<<<<< HEAD
import {CRUDService} from "../../shared/services/crud.service";
=======
import {CRUDService} from "../../shared/services/crud.service.ts";
>>>>>>> 67a52ae625f9120c17c1cf2a830e54b603ee416f

@Component({
    selector: 'add-edit-admin-user',
    templateUrl: './add-edit-admin-user.component.html',
    styleUrls: ['add-edit-admin-user.component.css']
})
export class AddEditAdminUserComponent {

    title: string = 'Додати адміністратора';
    entity: string = 'AdminUser';
    errorMessage: string;
    passwordConfirm: string;

    @Input() action: string;
    @Input() adminUser: User;
    @Input() username: string;
    @Input() password: string;
    @Input() id: number;
    @Input() email: string;
    @Output() refreshData = new EventEmitter();

    constructor(private modalService: NgbModal,
                private adminUserService: CRUDService) {
    }

    open(content) {
        this.modalService.open(content);
    }

    activate(): void {
        if (this.action === 'create') {
            if (this.password === this.passwordConfirm) {
                let newAdminUser = new User(this.username, this.password, this.email);
                this.adminUserService.insertData(this.entity, newAdminUser)
                    .subscribe(response => {
                        this.refreshData.emit('true');
                    });
            } else {
                alert("Введені паролі не збігаються, будь ласка спробуйте ще раз");
            }

        } else if (this.action === "edit") {
            if (this.password === this.passwordConfirm) {
                let editedAdminUser: User = new User(this.username, this.password, this.email);
                this.adminUserService.updateData(this.entity, this.id, editedAdminUser)
                    .subscribe(
                        response => {
                            this.refreshData.emit("true");
                        },
                        error => this.errorMessage = <any>error
                    );
            } else {
                alert("Введені паролі не збігаються, будь ласка спробуйте ще раз");
            }

        }

    }

    close() {
        if(this.action === "create") {
            this.username = "";
            this.email = "";
            this.password = "";
            this.passwordConfirm = "";
        } else if(this.action === "edit"){
            this.username = this.adminUser.username;
            this.email = this.adminUser.email;
            this.password = "";
            this.passwordConfirm = "";
        }
    }

}