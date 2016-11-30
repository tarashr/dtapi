import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

import {
    Faculty,
    ConfigModalAddEdit,
    ConfigTableHeader,
    ConfigTableAction,
    ConfigModalInfo
} from "../shared/classes";

import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {ModalAddEditComponent} from "../shared/components/addeditmodal/modal-add-edit.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CRUDService} from "../shared/services/crud.service.ts";
import {
    configAddFaculty, configEditFaculty, modalInfoConfig,
    maxSize,
    changeLimit, pageChange, getCountRecords, getRecordsRange,
    delRecord, findEntity, refreshData, successEventModal,
    headersFaculty, actionsFaculty,
    addTitle, searchTitle, entityTitle, selectLimitTitle
} from "../shared/constant";
import {ConfigTableData} from "../shared/classes/configs/config-table-data";
import {CommonService} from "../shared/services/common.service";


@Component({
    templateUrl: "faculty.component.html",
    styleUrls: ["faculty.component.css"]
})
export class FacultyComponent implements OnInit {

    public modalInfoConfig: ConfigModalInfo = modalInfoConfig;
    public configAdd: ConfigModalAddEdit = configAddFaculty;
    public configEdit: ConfigModalAddEdit = configEditFaculty;
    public paginationSize: number = maxSize;
    public headers: ConfigTableHeader[] = headersFaculty;
    public actions: ConfigTableAction[] = actionsFaculty;

    // constants for view
    public addTitle: string = addTitle;
    public searchTitle: string = searchTitle;
    public entityTitle: string = entityTitle;
    public selectLimitTitle: string = selectLimitTitle;
    //

    public entityData: any[] = [];
    public entityDataLength: number;
    public entity: string = "faculty";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;

    constructor(private crudService: CRUDService,
                private _router: Router,
                private modalService: NgbModal,
                private commonService: CommonService) {
    };

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public delRecord = delRecord;
    public refreshData = refreshData;
    public successEventModal = successEventModal;
    public getRecordsRange = getRecordsRange;
    public findEntity = findEntity;

    ngOnInit() {
        this.getCountRecords();
    }

    private createTableConfig = (data: Faculty[]) => {
        let tempArr: ConfigTableData[] = [];
        let numberOfOrder: number;
        data.forEach((item, i) => {
            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
            let faculty: any = {};
            faculty.entity_id = item.faculty_id + "";
            faculty.entityColumns = [numberOfOrder, item.faculty_name, item.faculty_description];
            tempArr.push(<ConfigTableData>faculty);
        });
        this.entityData = tempArr;
    };

    activate(data: ConfigTableData) {
        switch (data.action) {
            case "group":
                this._router.navigate(
                    ["/admin/group/byFaculty"],
                    {queryParams: {facultyId: data.entity_id}});
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
            .then((data: ConfigModalAddEdit) => {
                    let newFaculty: Faculty = new Faculty(data.list[0].value, data.list[1].value);
                    this.crudService.insertData(this.entity, newFaculty)
                        .subscribe(() => {
                            this.commonService.openModalInfo(`${data.list[0].value} успішно створено`);
                            this.refreshData(data.action);
                        });
                },
                this.handleReject);
    };

    editCase(data: ConfigTableData) {
        this.configEdit.list.forEach((item, i) => {
            item.value = data.entityColumns[i + 1];
        });
        this.configEdit.id = data.entity_id;
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: ConfigModalAddEdit) => {
                    let editedFaculty: Faculty = new Faculty(data.list[0].value, data.list[1].value);
                    this.crudService.updateData(this.entity, +data.id, editedFaculty)
                        .subscribe(() => {
                            this.commonService.openModalInfo(`Редагування пройшло успішно`);
                            this.refreshData(data.action);
                        });
                },
                this.handleReject);
    }

    deleteCase(data: ConfigTableData) {
        let message: string[] = [`Ви дійсно хочете видалити ${data.entityColumns[1]}?`, "confirm", "Попередження!"];
        this.commonService.openModalInfo(...message)
            .then(() => {
                    this.delRecord(this.entity, +data.entity_id);
                },
                this.handleReject);
    }

    handleReject = () => {};
}