import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {Speciality} from '../shared/classes/speciality';
import {CRUDService} from "../shared/services/crud.service";
import {CommonService} from "../shared/services/common.service";
import {
    configAddSpeciality,
    configEditSpeciality,
    maxSize,
    changeLimit,
    pageChange,
    getCountRecords,
    getRecordsRange,
    delRecord,
    findEntity,
    refreshData,
    successEventModal,
    headersSpeciality,
    actionsSpeciality,
    modalInfoConfig
} from "../shared/constant";
import {ConfigTableData} from "../shared/classes/configs/config-table-data";

@Component({
    templateUrl: "speciality.component.html"
})
export class SpecialityComponent implements OnInit {

    public modalInfoConfig: any = modalInfoConfig;
    public configAdd = configAddSpeciality;
    public configEdit = configEditSpeciality;
    public paginationSize = maxSize;
    public headers: any = headersSpeciality;
    public actions: any = actionsSpeciality;
    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Спеціальності";
    public selectLimit: string = "Виберіть кількість записів на сторінці";
    public entityData: any[] = [];
    private entityDataLength: number;
    public entity: string = "speciality";
    public limit: number = 5;
    public offset: number = 0;
    public search: string = "";
    public page: number = 1;

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public delRecord = delRecord;
    public refreshData = refreshData;
    public successEventModal = successEventModal;
    public getRecordsRange = getRecordsRange;
    public findEntity = findEntity;

    constructor(private crudService: CRUDService,
                private _router: Router,
                private modalService: NgbModal,
                private commonService: CommonService) {
    };

    ngOnInit() {
        this.getCountRecords();
    };

    private createTableConfig = (data: any ) => {
        let numberOfOrder: number;
        this.entityData = data.map((item, i) => {
            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
            const speciality: any = {};
            speciality.entity_id = item.speciality_id;
            speciality.entityColumns = [numberOfOrder, item.speciality_code, item.speciality_name];
            return speciality;
        });
    };

    activate(data: ConfigTableData) {
        switch (data.action) {
            case "viewGroup":
                this._router.navigate(
                    ["/admin/group/bySpeciality"],
                    {queryParams: {specialityId: data.entity_id}});
                break;
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


    createCase() {
        this.configAdd.list.forEach((item) => {
            item.value = "";
        });
        this.commonService.openModalAddEdit(this.configAdd)
            .then((data: any) => {
                const newSpeciality: Speciality = new Speciality(data.list[0].value, data.list[1].value);
                this.crudService.insertData(this.entity, newSpeciality)
                    .subscribe(response => {
                        this.commonService.openModalInfo(`${data.list[1].value} успішно створено`);
                        this.refreshData(data.action);
                    }, error => {
                        this.commonService.openModalInfo(`Спеціальність з такою назвою або кодом вже існує`);
                    });
            }, () => {
                return;
            });
    };

    editCase(data: ConfigTableData) {
        this.configEdit.list.forEach((item, i) => {
            item.value = data.entityColumns[i + 1];
        });
        this.configEdit.id = data.entity_id;
        this.commonService.openModalAddEdit(this.configEdit)
            .then((data: any) => {
                const editedSpeciality: Speciality = new Speciality(data.list[0].value, data.list[1].value);
                this.crudService.updateData(this.entity, data.id, editedSpeciality)
                    .subscribe(response => {
                        this.commonService.openModalInfo(`Редагування пройшло успішно`);
                        this.refreshData(data.action);
                    }, error => {
                        let message: string;
                        if (error === "400 - Bad Request") {
                            message = "Спеціальність з такою назвою або кодом вже існує";
                        } else {
                            message = "Невідома помилка! Зверніться до адміністратора.";
                        }
                        this.commonService.openModalInfo(message);
                    });
            }, () => {
                return;
            });
    };

    deleteCase(data: ConfigTableData) {
        let message: string[] = [`Ви дійсно хочете видалити ${data.entityColumns[2]}?`, "confirm", "Видалення"];
        this.commonService.openModalInfo(...message)
            .then(() => {
                this.delRecord(this.entity, +data.entity_id);
            }, () => {
                return;
            });
    };
}