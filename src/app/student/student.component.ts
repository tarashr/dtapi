import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {Student} from "../shared/classes/student";
import {Group} from "../shared/classes/group";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CRUDService} from "../shared/services/crud.service";
import {EntityManagerBody} from "../shared/classes/entity-manager-body";
import "../shared/rxjs-operators";
import {
    maxSize,
    changeLimit,
    pageChange,
    delRecord,
    getCountRecords,
    headersStudentAdmin,
    actionsStudentAdmin,
    modalInfoConfig
} from "../shared/constant";

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
    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Студенти";
    public selectLimit: string = "Виберіть кількість студентів на сторінці";
    //

    public entityData: any[] = [];
    private entityDataLength: number;
    public studentDataForView: Student[];
    public entity: string = "student";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;

    public groupId: number;
    public groupName: string;
    private subscription: Subscription;
    public noRecords: boolean = false;

    public groupEntity: string = "Group";
    public groups: Group[] = [];

    constructor(private crudService: CRUDService,
                private route: ActivatedRoute,
                private _router: Router,
                private modalService: NgbModal) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.groupId = data["groupId"];
            });
    }

    public changeLimit = changeLimit;
    public pageChange = pageChange;
    public delRecord = delRecord;
    public getCountRecords = getCountRecords;

    ngOnInit() {
        if (this.groupId) {
            this.showStudentsByGroup(this.groupId);
        } else {
            this.getCountRecords();
        }
    }

    showStudentsByGroup(groupId) {
        this.crudService.getRecordById(this.groupEntity, groupId)
            .subscribe(
                res => {
                    this.groupName = res[0].group_name;
                    this.entityTitle = `Студенти групи: ${this.groupName}`;
                },
                error => console.log("error: ", error)
            );
        this.getStudentsByGroup();
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
        this.noRecords = false;
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                    data => {
                    this.studentDataForView =  data;
                    this.getGroupName();
                },
                error => console.log("error: ", error));
    }

    getStudentsByGroup() {
        this.crudService.getStudentsByGroup(this.groupId)
            .subscribe(data => {
                if (data.response === "no records") {
                    this.noRecords = true;
                    return;
                }
                this.noRecords = false;
                this.page = 1;
                this.studentDataForView = data;
                this.getGroupName();

            }, error => console.log("error: ", error));
    }

    getGroupName(): void {
        let groupId: number[] = [];
        let data2 = this.studentDataForView;
        for (let i in data2) {
            groupId.push(data2[i].group_id);
        }
        let dataEnt = new EntityManagerBody(this.groupEntity, groupId);
        this.crudService.getEntityValues(dataEnt)
            .subscribe(
                groups => {
                    this.groups = groups;
                    for (let j in this.studentDataForView) {
                        for (let i in this.groups) {
                            if (this.studentDataForView[j].group_id === this.groups[i].group_id) {
                                this.studentDataForView[j].group_name = this.groups[i].group_name;
                            }
                        }
                    }
                    this.createTableConfig(this.studentDataForView);
                },
                error => console.log("error: ", error)
            );
    }

    findEntity(searchTerm: string) {
        this.search = searchTerm;
        if (!this.search.length) {
            this.offset = 0;
            this.page = 1;
            this.getCountRecords();
            return;
        }
        this.crudService.getRecordsBySearch(this.entity, this.search)
            .subscribe(data => {
                if (data.response === "no records") {
                    this.noRecords = true;
                    this.entityData = [];
                    return;
                }
                this.page = 1;
                this.studentDataForView = data;
                this.getGroupName();

            }, error => console.log("error: ", error));
    };

    activate(data: any) {
        switch (data.action) {
            case "create":
                this._router.navigate(["/admin/student/student-profile"]);
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

    refreshData(action: string) {
        if (this.groupId) {
            this.entityTitle = `Студенти групи: ${this.groupName}`;
            this.getStudentsByGroup();
        } else {
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
                    error => console.log(error)
                );
        }
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}