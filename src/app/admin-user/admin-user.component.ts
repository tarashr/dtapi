import {Component, OnInit} from "@angular/core";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {ModalAddEditComponent} from "../shared/components/addeditmodal/modal-add-edit.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

import {User} from "../shared/classes/user";
import {CRUDService} from "../shared/services/crud.service.ts";
import {
    configAddAdminUser,
    configEditAdminUser,
    maxSize,
    changeLimit,
    pageChange,
    getCountRecords,
    getRecordsRange,
    delRecord,
    findEntity,
    refreshData,
    successEventModal,
    headersAdminUser,
    actionsAdminUser,
    modalInfoConfig
} from "../shared/constant";


@Component({
    templateUrl: "admin-user.component.html"
})
export class AdminUserComponent implements OnInit {

    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Адміністратори";
    public selectLimit: string = "Виберіть кількість записів на сторінці";
    public entityData: any[] = [];
    private entityDataLength: number;
    public entity: string = "AdminUser";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;

    public modalInfoConfig: any = modalInfoConfig;
    public configAdd = configAddAdminUser;
    public configEdit = configEditAdminUser;
    public paginationSize = maxSize;
    public headers: any = headersAdminUser;
    public actions: any = actionsAdminUser;

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public delRecord = delRecord;
    public refreshData = refreshData;
    public successEventModal = successEventModal;
    public getRecordsRange = getRecordsRange;
    public findEntity = findEntity;

    constructor(private crudService: CRUDService,
                private modalService: NgbModal) {
    };

    ngOnInit(): void {
        this.getCountRecords();
    };

    private createTableConfig = (data: any) => {
        let numberOfOrder: number;
        this.entityData = data.map((item, i ) => {
                numberOfOrder = i + 1 + (this.page - 1) * this.limit;
                const adminUser: any = {};
                adminUser.entity_id = item.id;
                adminUser.entityColumns = [numberOfOrder, item.username, item.email];
                return adminUser;
        });
    };

    activate(data: any) {
        switch (data.action) {
            case "create":
                this.createCase();
                break;
            case "edit":
                this.editCase(data);
                break;
            case "delete":
                this.deleteCase(data);
                break;
        };
    };

    createCase(userToChange?: User) {
        this.configAdd.list.forEach((item) => {
            item.value = "";
        });
        if (userToChange) {
            this.configAdd.list[0].value = userToChange.username;
            this.configAdd.list[1].value = userToChange.email;
            this.configAdd.list[2].value = userToChange.password;
            this.configAdd.list[3].value = userToChange.password_confirm;
        }
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                const newAdminUser: User = new User(
                    data.list[0].value,
                    data.list[1].value,
                    data.list[2].value,
                    data.list[3].value);
                this.crudService.insertData(this.entity, newAdminUser)
                    .subscribe(response => {
                            this.modalInfoConfig.infoString = `${data.list[0].value} успішно створено`;
                            this.configAdd.list.forEach((item) => {
                                item.value = "";
                            });
                            this.successEventModal();
                            this.refreshData(data.action);
                    }, error => {
                            this.modalInfoConfig.infoString = `Пароль та логін повинні бути унікальними`;
                            this.createCase(newAdminUser);
                            this.successEventModal();
                        }
                    );
            }, () => {
                return;
            });
    };

    editCase(data: any) {
        const editData = data;
        this.configEdit.list.forEach((item, i) => {
            item.value = data.entityColumns[i + 1];
        });
        this.configEdit.id = data.entity_id;
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                let editedAdminUser: User = new User(
                    data.list[0].value,
                    data.list[1].value,
                    data.list[2].value,
                    data.list[3].value);
                this.crudService.updateData(this.entity, data.id, editedAdminUser)
                    .subscribe(response => {
                            this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                            this.successEventModal();
                            this.refreshData(data.action);
                    }, error => {
                            this.modalInfoConfig.infoString = `Пароль та логін повинні бути унікальними`;
                            this.editCase(editData);
                            this.successEventModal();
                    }
                    );
            }, () => {
                return;
            });
    };

    deleteCase(data: any) {
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати ${data.entityColumns[1]}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.delRecord(this.entity, data.entity_id);
            }, () => {
                return;
            });
    };

};