import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {ModalAddEditComponent} from "../shared/components/addeditmodal/modal-add-edit.component";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {Speciality} from '../shared/classes/speciality';
import {CRUDService} from "../shared/services/crud.service";
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

@Component({
    templateUrl:"speciality.component.html"
})
export class SpecialityComponent implements OnInit{

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
                private modalService: NgbModal) {
    };

    ngOnInit() {
        this.getCountRecords();
    }

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

    activate(data: any) {
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
    }


    createCase() {
        this.configAdd.list.forEach((item) => {
            item.value = "";
        });
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                const newSpeciality: Speciality = new Speciality(data.list[0].value, data.list[1].value);
                this.crudService.insertData(this.entity, newSpeciality)
                    .subscribe(response => {
                        this.modalInfoConfig.infoString = `${data.list[1].value} успішно створено`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, () => {
                return;
            });
    };

    editCase(data: any) {
        this.configEdit.list.forEach((item, i) => {
            item.value = data.entityColumns[i + 1];
        });
        this.configEdit.id = data.entity_id;
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                const editedSpeciality: Speciality = new Speciality(data.list[0].value, data.list[1].value);
                this.crudService.updateData(this.entity, data.id, editedSpeciality)
                    .subscribe(response => {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, () => {
                return;
            });
    }

    deleteCase(data: any) {
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати ${data.entityColumns[0]}?`;
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
    }

}