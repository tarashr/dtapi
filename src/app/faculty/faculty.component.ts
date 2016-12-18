import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

import {
    Faculty,
    ConfigModalAddEdit,
    ConfigTableHeader,
    ConfigTableAction,
    ConfigModalInfo
} from "../shared/classes";

import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CRUDService} from "../shared/services/crud.service.ts";
import {
    configAddFaculty, configEditFaculty, modalInfoConfig,
    maxSize,
    changeLimit, pageChange, getCountRecords, getRecordsRange,
    delRecord, findEntity, refreshData,
    headersFaculty, actionsFaculty,
    addTitle, searchTitle, entityTitle, selectLimitTitle
} from "../shared/constant";
import {ConfigTableData} from "../shared/classes/configs/config-table-data";
import {CommonService} from "../shared/services/common.service";


@Component({
    templateUrl: "faculty.component.html",
    styleUrls: ["faculty.component.scss"]
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
                private commonService: CommonService) {
    };

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    public delRecord = delRecord;
    public refreshData = refreshData;
    public getRecordsRange = getRecordsRange;
    public findEntity = findEntity;

    ngOnInit() {
        this.getCountRecords();
    }

    private createTableConfig = (data: Faculty[]) => {
        let numberOfOrder: number;
        this.entityData = data.map((item, i) => {
            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
            let faculty: any = {};
            faculty.entity_id = item.faculty_id + "";
            faculty.entityColumns = [numberOfOrder, item.faculty_name, item.faculty_description];
            return <ConfigTableData>faculty;
        });
    };

    activate(data: ConfigTableData) {
        let run = {
            group: this.groupCase,
            create: this.createCase,
            edit: this.editCase,
            delete: this.deleteCase
        };

        run[data.action](data);
    }

    groupCase = (data: ConfigTableData) => {
        this._router.navigate(
            ["/admin/group/byFaculty"],
            {queryParams: {facultyId: data.entity_id}});
    };

    createCase = (data: ConfigTableData) => {
        this.configAdd.list.forEach((item) => {
            item.value = "";
        });
        this.commonService.openModalAddEdit(this.configAdd)
            .then((data: ConfigModalAddEdit) => {
                    let newFaculty: Faculty = new Faculty(data.list[0].value, data.list[1].value);
                    this.crudService.insertData(this.entity, newFaculty)
                        .subscribe(() => {
                            this.commonService.openModalInfo(`${data.list[0].value} успішно створено`);
                            this.refreshData(data.action);
                        }, this.errorAddEdit);
                },
                this.handleReject);
    };

    editCase = (data: ConfigTableData) => {
        this.configEdit.list.forEach((item, i) => {
            item.value = data.entityColumns[i + 1];
        });
        this.configEdit.id = data.entity_id;
        this.commonService.openModalAddEdit(this.configEdit)
            .then((data: ConfigModalAddEdit) => {
                    let editedFaculty: Faculty = new Faculty(data.list[0].value, data.list[1].value);
                    this.crudService.updateData(this.entity, +data.id, editedFaculty)
                        .subscribe(() => {
                            this.commonService.openModalInfo(`Редагування пройшло успішно`);
                            this.refreshData(data.action);
                        }, this.errorAddEdit);
                },
                this.handleReject);
    };

    deleteCase = (data: ConfigTableData) => {
        let message: string[] = [`Ви дійсно хочете видалити ${data.entityColumns[1]}?`, "confirm", "Попередження!"];
        this.commonService.openModalInfo(...message)
            .then(() => {
                    this.delRecord(this.entity, +data.entity_id);
                },
                this.handleReject);
    };

    errorAddEdit = (error) => {
        let message: string;
        if (error === "400 - Bad Request") {
            message = `Факультет з такою назвою вже існує`;
        } else {
            message = "Невідома помилка! Зверніться до адміністратора."
        }
        this.commonService.openModalInfo(message)
    };

    handleReject = () => {
    };
}