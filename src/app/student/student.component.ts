import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {CRUDService} from "../shared/services/crud.service";
import {CommonService} from "../shared/services/common.service";
import {Group, Student, EntityManagerBody} from "../shared/classes";
import {Subscription} from "rxjs";
import {
    maxSize, headersStudentAdmin, actionsStudentAdmin, modalInfoConfig,
    changeLimit, pageChange, delRecord, getCountRecords
} from "../shared/constant";

@Component({
    templateUrl: "student.component.html",
    styleUrls: ["student.component.scss"]
})

export class StudentComponent implements OnInit {

    public modalInfoConfig: any = modalInfoConfig;
    public paginationSize: number = maxSize;
    public headers: any = headersStudentAdmin;
    public actions: any = actionsStudentAdmin;

    // constants for view
    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Студенти";
    public selectLimit: string = "Виберіть кількість студентів на сторінці";
    //

    public entityData: any[] = [];
    public studentDataForView: Student[];
    public groupEntity: string = "Group";
    public groups: Group[] = [];
    public entity: string = "student";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;
    public groupId: number;
    public groupName: string;
    public noRecords: boolean = false;
    private subscription: Subscription;
    private entityDataLength: number;

    constructor(private crudService: CRUDService,
                private route: ActivatedRoute,
                private _router: Router,
                private commonService: CommonService) {
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
                error => this.commonService.handleError(error)
            );
        this.getStudentsByGroup();
    }

    private createTableConfig = (data: any) => {
        let numberOfOrder: number;
        this.entityData = data.map((item, i) => {
            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
            const student: any = {};
            student.entity_id = item.user_id;
            student.entityColumns = [numberOfOrder, (item.student_surname + " " + item.student_name + " " +
            item.student_fname), item.gradebook_id, item.group_name];
            return student;
        });
    };

    getRecordsRange() {
        this.noRecords = false;
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    this.studentDataForView = data;
                    this.getGroupName();
                },
                error => this.commonService.handleError(error)
            );
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
            }, error => this.commonService.handleError(error)
            );
    }

    getGroupName(): void {
        let groupId: number[] = [];
        let data = this.studentDataForView;
        for (let i in data) {
            groupId.push(data[i].group_id);
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
                error => this.commonService.handleError(error)
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

            }, error => this.commonService.handleError(error)
            );
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
        let message: string[] = [`Ви дійсно хочете видалити профіль студента: ${data.entityColumns[1]}?`, "confirm", "Попередження!"];
        this.commonService.openModalInfo(...message)
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
                    error => this.commonService.handleError(error)
                );
        }
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}