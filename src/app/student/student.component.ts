import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {Student} from "../shared/classes/student";
import {Group} from "../shared/classes/group";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CRUDService} from "../shared/services/crud.service.ts";
import {EntityManagerBody} from "../shared/classes/entity-manager-body";
import "../shared/rxjs-operators";
import {
    maxSize,
    changeLimit,
    pageChange,
    delRecord,
    refreshData,
    getCountRecords,
    headersStudentAdmin,
    actionsStudentAdmin,
    modalInfoConfig
    // findEntity,
    // getRecordsRange,
    // changeLimit
} from "../shared/constant";

/*import {Observable} from "rxjs";*/

@Component({
    templateUrl: "student.component.html",
    styleUrls: ["student.component.css"]
})

export class StudentComponent implements OnInit {

    public modalInfoConfig: any = modalInfoConfig;
    public paginationSize = maxSize;
    public headers: any = headersStudentAdmin;
    public actions: any = actionsStudentAdmin;

    // constants for view
    public addTitle: string = "Додати нового студента";
    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Студенти";
    public selectLimit: string = "Виберіть кількість студентів на сторінці";
    //

    public entityData: any[] = [];
    private entityDataLength: number;
    public entityData2: Student[];
    public entity: string = "student";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;

    public groupEntity: string = "Group";
    public groups: Group[] = [];

    constructor(private crudService: CRUDService,
                private _router: Router,
                private modalService: NgbModal) {
    }

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public delRecord = delRecord;
    public refreshData = refreshData;
    public getCountRecords = getCountRecords;
    // public findEntity = findEntity;
    // public getRecordsRange = getRecordsRange;
    // public errorMessage: string;

    ngOnInit() {
        this.getCountRecords();
        // this.getRecordsRange();
    }

    private createTableConfig = (data: any) => {
        let tempArr: any[] = [];
        let numberOfOrder: number;
        data.forEach((item, i) => {
            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
            let student: any = {};
            student.entity_id = item.user_id;
            student.entityColumns = [numberOfOrder, (item.student_surname + " " + item.student_name + " " + item.student_fname), item.gradebook_id, item.group_name];
            tempArr.push(student);
        });
        this.entityData = tempArr;
    };

    getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                    data => {
                    this.entityData2 =  data;
                    this.getGroupName();
                },
                error => console.log("error: ", error));
    }

    getGroupName(): void {
        let groupId: number[] = [];
        let data2 = this.entityData2;
        for (let i in data2) {
            groupId.push(data2[i].group_id);
        }
        let dataEnt = new EntityManagerBody(this.groupEntity, groupId);
        this.crudService.getEntityValues(dataEnt)
            .subscribe(
                groups => {
                    this.groups = groups;
                    for (let j in this.entityData2)
                        for (let i in this.groups) {
                            if (this.entityData2[j].group_id === this.groups[i].group_id) {
                                this.entityData2[j].group_name = this.groups[i].group_name;
                            }
                        }
                    this.createTableConfig(this.entityData2);
                },
                error => console.log("error: ", error)
            );
    }

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
                if (data.response === "no records") {
                    this.entityData = [];
                    return;
                }
                this.page = 1;
                this.entityData2 = data;
                this.getGroupName();

            }, error => console.log("error: ", error));
    };

    activate(data: any) {
        switch (data.action) {
            case "create":
                this._router.navigate(["/admin/student/student-new-profile"]);
                break;
            case "view":
                this._router.navigate(["/admin/student/student-profile", data.entity_id]);
                break;
            case "delete":
                this.deleteCase(data);
                break;
        }
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