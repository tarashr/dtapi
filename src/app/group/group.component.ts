import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Group} from '../shared/classes/group';
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {ModalAddEditComponent} from "../shared/components/addeditmodal/modal-add-edit.component";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CRUDService} from "../shared/services/crud.service.ts";
import {
    configAddGroup,
    configEditGroup,
    maxSize,
    changeLimit,
    pageChange,
    getCountRecords,
    getRecordsRange,
    delRecord,
    // findEntity,
    refreshData,
    successEventModal
} from "../shared/constants";
import {
    headersGroup,
    actionsGroup
} from "../shared/constant-config"

@Component({
    templateUrl: 'group.component.html',
    styleUrls: ['group.component.css']
})
export class GroupComponent implements OnInit {

    public modalInfoConfig = {
        title: "",
        infoString: "",
        action: ""
    };

    public configAdd = configAddGroup;
    public configEdit = configEditGroup;
    public paginationSize = maxSize;
    public headers: any = headersGroup;
    public actions: any = actionsGroup;

    //constants for view
    public addTitle: string = "Створити нову групу";
    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Групи";
    public selectLimit: string = "Виберіть кількість записів на сторінці";
    //

    public entityData: any[] = [];
    private entityDataLength: number;
    public entity: string = "group";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;

    constructor(private crudService: CRUDService,
                private _router: Router,
                private modalService: NgbModal) {
    };

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public delRecord = delRecord;
    public refreshData = refreshData;
    public successEventModal = successEventModal;

    ngOnInit() {
        this.getCountRecords();
    }

    private createTableConfig = (data: any)=> {
        let tempArr: any[] = [];
        data.forEach((item)=> {
            let group: any = {};
            group.entity_id = item.group_id;
            group.entityColumns = [item.group_name, item.faculty_id, item.speciality_id];
            tempArr.push(group);
        });
        this.entityData = tempArr;
    };

    getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    this.createTableConfig(data);
                },
                error=> console.log("error: ", error))
    };

    findEntity(searchTerm: string) {
        this.search = searchTerm;
        if (this.search.length === 0) {
            this.offset = 0;
            this.page = 1;
            this.getCountRecords();
            return;
        }

        this.crudService.getRecordsBySearch(this.entity, this.search)
            .subscribe(data => {
                if (data.response == "no records") {
                    this.entityData = [];
                    return;
                }
                this.page = 1;
                this.createTableConfig(data);
            }, error=>console.log("error: ", error));
    };

    activate(data: any) {
        switch (data.action) {
            case "group":
                this._router.navigate(["/admin/faculty", data.entity_id, "groups"]);
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
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                let newGroup: Group = new Group(data.list[0].value, data.list[1].value, data.list[2].value);
                this.crudService.insertData(this.entity, newGroup)
                    .subscribe(response=> {
                        this.modalInfoConfig.infoString = `${data.list[0].value} успішно створено`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, ()=> {
                return
            });
    };

    editCase(data:any){
        this.configEdit.list.forEach((item, i)=> {
            item.value = data.entityColumns[i]
        });
        this.configEdit.id = data.entity_id;
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                let newGroup: Group = new Group(data.list[0].value, data.list[1].value, data.list[2].value);
                this.crudService.insertData(this.entity, newGroup)
                    .subscribe(response=> {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, ()=> {
                return
            });
    }

    deleteCase(data:any){
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати ${data.entityColumns[0]}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.delRecord(this.entity, data.entity_id);
            }, ()=> {
                return
            });
    }
}
