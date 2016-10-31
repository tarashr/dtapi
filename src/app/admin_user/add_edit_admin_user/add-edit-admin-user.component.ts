import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {User} from '../../shared/classes/user';
import {CRUDService} from "../../shared/services/crud.service";

@Component({
    selector: 'add-edit-admin-user',
    templateUrl: './add-edit-admin-user.component.html',
    styleUrls: ['add-edit-admin-user.component.css']
})
export class AddEditAdminUserComponent {


    public entity: string = 'AdminUser';
    public errorMessage: string;
    public oldPassword: string;
    public passwordConfirm: string;

    @Input() title: string;
    @Input() action: string;
    @Input() speciality: User;
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
            let newAdminUser = new User(this.username, this.password, this.email);
            this.adminUserService.insertData(this.entity, newAdminUser)
                .subscribe(response => {
                    this.refreshData.emit('true');
                });
        } else if (this.action === "edit") {
            let editedAdminUser: User = new User(this.username, this.password, this.email);
            this.adminUserService.updateData(this.entity, this.id, editedAdminUser)
                .subscribe(
                    response => {
                        this.refreshData.emit("true");
                    },
                    error => this.errorMessage = <any> error
                );
        }
    }

    close() {
        if(this.action === "create") {
            this.username = "";
            this.email = "";
            this.password = "";
            this.passwordConfirm = "";
        } else if(this.action === "edit"){
            this.username = this.speciality.username;
            this.email = this.speciality.email;
            this.password = "";
            this.passwordConfirm = "";
        }
    }

}