import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Faculty} from "../shared/classes/faculty";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
    // findEntity,
    refreshData
} from "../shared/constants";
import {
    headersFaculty,
    actionsFaculty
} from "../shared/constant-config"

@Component({
    templateUrl: 'faculty.component.html',
    styleUrls: ['faculty.component.css']
})
export class FacultyComponent implements OnInit {

    @ViewChild(InfoModalComponent)
    private infoModal: InfoModalComponent;

    public modalInfoConfig = {
        title: "Видалення",
        infoString: "",
        action: "confirm"
    };
    public configAdd = configAddFaculty;
    public configEdit = configEditFaculty;
    public paginationSize = maxSize;
    public headers: any = headersFaculty;
    public actions: any = actionsFaculty;

    //constants for view
    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Факультети";
    public selectLimit: string = "Виберіть кількість факультетів на сторінці";
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

    ngOnInit() {
        this.getCountRecords();
    }

    private createTableConfig = (data: any)=> {
        let tempArr: any[] = [];
        data.forEach((item)=> {
            let faculty: any = {};
            faculty.entity_id = item.faculty_id;
            faculty.entityColumns = [item.faculty_name, item.faculty_description];
            tempArr.push(faculty);
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
                this.modalInfoConfig.infoString=`Ви дійсно хочете видати ${data.entityColumns[0]}?`;
                this.modalInfoConfig.action="confirm";
                this.modalInfoConfig.title="Видалення";
                this.modalService.open(this.infoModal.modalWindow, {size: "sm"}).result
                    .then(() => {
                        this.delRecord(this.entity, data.entity_id);
                    }, ()=>{return});
                break;
        }
    }

    // openInfoModal() {
    //     this.infoModal.open(this.infoModal.modalWindow);
    // }

    modalAdd(data: any) {
        if (data.action === "create") {
            let newFaculty: Faculty = new Faculty(data.list[0].value, data.list[1].value);
            this.crudService.insertData(this.entity, newFaculty)
                .subscribe(response=> {
                    this.refreshData(data.action);
                });
        } else if (data.action === "edit") {
            let editedFaculty: Faculty = new Faculty(data.list[0].value, data.list[1].value);
            this.crudService.updateData(this.entity, data.id, editedFaculty)
                .subscribe(response=> {
                    this.refreshData(data.action);
                });
        }
    }
}