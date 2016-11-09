import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {Faculty} from "../shared/classes/faculty";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {ModalAddEditComponent} from "../shared/components/addeditmodal/modal-add-edit.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CRUDService} from "../shared/services/crud.service.ts";
import {
    configAddFaculty,
    configEditFaculty,
    maxSize,
    changeLimit,
    pageChange,
    getCountRecords,
    getRecordsRange,
    delRecord,
    findEntity,
    refreshData,
    successEventModal,
    headersFaculty,
    actionsFaculty,
    modalInfoConfig
} from "../shared/constant";

@Component({
    templateUrl: "faculty.component.html",
    styleUrls: ["faculty.component.css"]
})
export class FacultyComponent implements OnInit {

    public modalInfoConfig: any = modalInfoConfig;
    public configAdd: any = configAddFaculty;
    public configEdit: any = configEditFaculty;
    public paginationSize: number = maxSize;
    public headers: any = headersFaculty;
    public actions: any = actionsFaculty;

    // constants for view
    public addTitle: string = "Створити новий факультет";
    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Факультети";
    public selectLimitTitle: string = "Виберіть кількість факультетів на сторінці";
    //

    public entityData: any[] = [];
    private entityDataLength: number;
    public entity: string = "faculty";
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
    getRecordsRange = getRecordsRange;
    findEntity = findEntity;

    ngOnInit() {
        this.getCountRecords();
    }

    private createTableConfig = (data: any) => {
        let tempArr: any[] = [];
        let numberOfOrder: number;
        data.forEach((item, i) => {
            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
            let faculty: any = {};
            faculty.entity_id = item.faculty_id;
            faculty.entityColumns = [numberOfOrder, item.faculty_name, item.faculty_description];
            tempArr.push(faculty);
        });
        this.entityData = tempArr;
    };

    activate(data: any) {
        switch (data.action) {
            case "group":
                this._router.navigate(
                    ["/admin/group"],
                    {queryParams: {facultyId: data.entity_id, facultyName: data.entityColumns[1]}});
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
                let newFaculty: Faculty = new Faculty(data.list[0].value, data.list[1].value);
                this.crudService.insertData(this.entity, newFaculty)
                    .subscribe(response => {
                        this.modalInfoConfig.infoString = `${data.list[0].value} успішно створено`;
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
                let editedFaculty: Faculty = new Faculty(data.list[0].value, data.list[1].value);
                this.crudService.updateData(this.entity, data.id, editedFaculty)
                    .subscribe(() => {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, () => {
                return;
            });
    }

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
    }
}