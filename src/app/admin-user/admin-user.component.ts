import {Component, OnInit} from "@angular/core";

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
import {CommonService} from "../shared/services/common.service";

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
                private commonService: CommonService) {
    };

    ngOnInit() {
        this.getCountRecords();
    };

    activate(data: any): void {
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
        }
    };

    createCase(userToChange?: User): void {
        this.configAdd.list.forEach((item) => {
            item.value = "";
        });
        if (userToChange) {
            this.configAdd.list[0].value = userToChange.username;
            this.configAdd.list[1].value = userToChange.email;
            this.configAdd.list[2].value = userToChange.password;
            this.configAdd.list[3].value = userToChange.password_confirm;
        }
        this.commonService.openModalAddEdit(this.configAdd)
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
                        if (error === "400 - Bad Request") {
                            this.modalInfoConfig.infoString = "Даний логін або пошта вже використовуються іншим користувачем";
                            this.createCase(newAdminUser);
                        } else {
                            this.modalInfoConfig.infoString = "Невідома помилка! Зверніться до адміністратора.";
                        }
                        this.successEventModal();
                    });
            }, () => {
                return;
            });
    };

    editCase(data: any): void {
        const editData = data;
        this.configEdit.list.forEach((item, i) => {
            item.value = data.entityColumns[i + 1];
        });
        this.configEdit.oldPassword = data.oldPassword;
        this.configEdit.id = data.entity_id;
        this.commonService.openModalAddEdit(this.configEdit)
            .then((data: any) => {
                let editedAdminUser: User = new User(
                    data.list[0].value,
                    data.list[1].value,
                    data.list[3].value,
                    data.list[4].value);
                this.crudService.updateData(this.entity, data.id, editedAdminUser)
                    .subscribe(response => {
                            this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                            this.successEventModal();
                            this.refreshData(data.action);
                    }, error => {
                        if (error === "400 - Bad Request") {
                            this.modalInfoConfig.infoString = "Даний логін або пошта вже використовуються іншим користувачем";
                            this.editCase(editData);
                        } else {
                            this.modalInfoConfig.infoString = "Невідома помилка! Зверніться до адміністратора.";
                        }
                        this.successEventModal();
                    });
            }, () => {
                return;
            });
    };

    deleteCase(data: any): void {
        let message: string[] = [`Ви дійсно хочете видалити ${data.entityColumns[1]}?`, "confirm", "Попередження!"];
        this.commonService.openModalInfo(...message)
            .then(() => {
                this.delRecord(this.entity, data.entity_id);
            }, () => {
                return;
            });
    };

    private createTableConfig = (data: any) => {
        let numberOfOrder: number;
        this.entityData = data.map((item, i ) => {
            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
            const adminUser: any = {};
            adminUser.entity_id = item.id;
            adminUser.oldPassword = item.password;
            adminUser.entityColumns = [numberOfOrder, item.username, item.email];
            return adminUser;
        });
    };
}