import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Faculty} from "../shared/classes/faculty";
import {CRUDService} from "../shared/services/crud.service.ts";
import {AddEditModalComponent} from "../shared/components/addeditmodal/add-edit-modal.component";
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
    refreshData
} from "../shared/constants"


@Component({
    templateUrl: 'faculty.component.html',
    styleUrls: ['faculty.component.css']
})
export class FacultyComponent implements OnInit {

    public configAdd = configAddFaculty;
    public configEdit = configEditFaculty;
    public paginationSize = maxSize;

    //constants for view
    public grupsOfFaculty: string = "Переглянути групи факультету";
    public deleteFaculty: string = "Видалити факультет";
    public selectLimit: string = "Виберіть кількість факультетів на сторінці";
    public serchTitle: string = "Введіть дані для пошуку";
    //

    public entityData: any[] = [];
    private entityDataLength: number;
    public entity: string = "faculty";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;

    headers = [
        {name: "№", style: "col-xs-12 col-sm-1"},
        {name: "Назва факультету", style: "col-xs-12 col-sm-4"},
        {name: "Опис Факультету", style: "col-xs-12 col-sm-4"},
        {name: "", style: "col-xs-12 col-sm-3"}
    ];

    actions = [
        {title: "Перейти до груп факультету", action: "group", style: "glyphicon glyphicon-th"},
        {title: "Редагувати факультет", action: "edit", style: "glyphicon glyphicon-edit"},
        {title: "Видалити факультет", action: "delete", style: "glyphicon glyphicon-trash"}
    ];

    // private tableData: any[] = [];

    // tableData = [
    //     {
    //         entityColumns: ["Факультет економіки", "Факультет на якому вчаться економити"],
    //         entity_id: 1,
    //         actions: [
    //             {title: "Перейти до груп факультету", action: "groups", style: "glyphicon glyphicon-th"},
    //             {title: "Редагувати факультет", action: "edit", style: "glyphicon glyphicon-edit"},
    //             {title: "Видалити факультет", action: "delete", style: "glyphicon glyphicon-trash"}
    //         ]
    //     },
    //     {
    //         entityColumns: ["Факультет математики", "Факультет на якому вчаться рахувати"],
    //         entity_id: 2,
    //         actions: [
    //             {title: "Перейти до груп факультету", action: "groups", style: "glyphicon glyphicon-th"},
    //             {title: "Редагувати факультет", action: "edit", style: "glyphicon glyphicon-edit"},
    //             {title: "Видалити факультет", action: "delete", style: "glyphicon glyphicon-trash"}
    //         ]
    //     }
    // ];

    constructor(private crudService: CRUDService,
                private _router: Router) {
    };

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public getCountRecords = getCountRecords;
    // public getRecordsRange = getRecordsRange;
    public delRecord = delRecord;
    // public findEntity = findEntity;
    // public refreshData = refreshData;

    ngOnInit() {
        this.getCountRecords();
    }

    getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    let tempArr: any[] = [];
                    data.forEach((item)=> {
                        let faculty: any = {};
                        faculty.entity_id = item.faculty_id;
                        faculty.entityColumns = [item.faculty_name, item.faculty_description];
                        faculty.actions = this.actions;
                        tempArr.push(faculty);
                    });
                    this.entityData = tempArr;
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
                let tempArr: any[] = [];
                data.forEach((item)=> {
                    let faculty: any = {};
                    faculty.entity_id = item.faculty_id;
                    faculty.entityColumns = [item.faculty_name, item.faculty_description];
                    faculty.actions = this.actions;
                    tempArr.push(faculty);
                });
                this.entityData = tempArr;
            }, error=>console.log("error: ", error));
    };

    activate(data: any) {
        console.log("!!! ", data);
        switch (data.action) {
            case "group":
                this._router.navigate(["/admin/faculty", data.entity_id, "groups"]);
                break;
            case "edit":
                console.log("we will edit ", data.entityColumns[0] + " with id: " + data.entity_id);
                break;
            case "delete":
                console.log("we will delete ", data.entityColumns[0] + " with id: " + data.entity_id);
                this.delRecord(this.entity, data.entity_id);
                break;
        }
    }

    modalAdd(data: any) {
        if (data.action === "create") {
            let newFaculty: Faculty = new Faculty(data.list[0].value, data.list[1].value);
            this.crudService.insertData(this.entity, newFaculty)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        } else if (data.action === "edit") {
            let editedFaculty: Faculty = new Faculty(data.list[0].value, data.list[1].value);
            this.crudService.updateData(this.entity, data.id, editedFaculty)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        }
    }

    refreshData(action: string) {
        if (action === "delete" && this.entityData.length === 1 && this.entityDataLength > 1) {
            this.offset = (this.page - 2) * this.limit;
            this.page -= 1;
        } else if (this.entityData.length > 1) {
            this.offset = (this.page - 1) * this.limit;
        }

        this.crudService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.entityDataLength = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>console.log(error)
            );
    }
}