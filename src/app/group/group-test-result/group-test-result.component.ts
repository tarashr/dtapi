import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Subscription} from "rxjs";

import {GroupService} from "../../shared/services/group.service";
import {EntityManagerBody} from "../../shared/classes/entity-manager-body";
import {headersGroupTestResult} from "../../shared/constant";
import {CRUDService} from "../../shared/services/crud.service";

@Component({
    templateUrl: "group-test-result.component.html",
    styleUrls: ["group-test-result.component.css"]
})
export class GroupTestResultComponent implements OnInit {

    public page: number = 1;
    public limit: number = 0;
    public noRecords: boolean = false;
    public entityData: any[] = [];
    public entityDataWithNames: any ;
    public maxResult: number = 100;
    public testId: number;
    public testName: string;
    public testEntity: string = "Test";
    public groupId: number;
    public groupName: string;
    public groupEntity: string = "Group";
    public subjectId: number;
    public subjectName: string;
    public subjectEntity: string = "Subject";
    public studentEntity: string = "Student";
    public headers: any = headersGroupTestResult;

    private subscription: Subscription;

    constructor(private location: Location,
                private route: ActivatedRoute,
                private groupService: GroupService,
                private crudService: CRUDService) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.groupId = data["groupId"];
                this.testId = data["testId"];
                this.subjectId = data["subjectId"];
            });
    };

    ngOnInit() {
        this.getRecords();
        this.getGroupName();
        this.getTestName();
        this.getSubjectName();
    };

    getGroupName() {
        this.crudService.getRecordById(this.groupEntity, this.groupId)
            .subscribe(
                data => {
                    this.groupName = data[0].group_name;
                },
                error => console.log("error: ", error)
            );
    };

    getTestName() {
        this.crudService.getRecordById(this.testEntity, this.testId)
            .subscribe(
                data => {
                    this.testName = data[0].test_name;
                },
                error => console.log("error: ", error)
            );
    };

    getSubjectName() {
        this.crudService.getRecordById(this.subjectEntity, this.subjectId)
            .subscribe(
                data => {
                    this.subjectName = data[0].subject_name;
                },
                error => console.log("error: ", error)
            );
    };

    getRecords(): void {
        this.groupService.getTestResult(this.testId, this.groupId)
            .subscribe(
                data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                    } else {
                        this.entityDataWithNames = data;
                        this.noRecords = false;
                        const ids = [];
                        this.maxResult = +data[0].answers
                        data.forEach(item => {
                            ids.push(item.student_id);
                            item.resultInPercentage = (+item.result / this.maxResult) * 100;
                            item.resultNational = this.groupService.toNationalRate(item.resultInPercentage);
                            item.resultECTS = this.groupService.toECTSRate(item.resultInPercentage);
                        });
                        let entityManagerStudent = new EntityManagerBody(this.studentEntity, ids);
                        this.getStudentName(entityManagerStudent);
                    }
                },
                error => console.log("error: ", error)
            );
    };

    getStudentName(param: EntityManagerBody): void {
        this.crudService.getEntityValues(param)
            .subscribe(
                data => {
                    this.getNamesByIds(data);
                }
            );
    };

    getNamesByIds(data: any): void {
        for (let i in this.entityDataWithNames) {
            for (let k in data) {
                if (this.entityDataWithNames[i].student_id === data[k].user_id) {
                    this.entityDataWithNames[i].student_name =
                        `${data[k].student_surname} ${data[k].student_name} ${data[k].student_fname}`;
                }
            }
        }
        this.createTableConfig(this.entityDataWithNames);
    };

    goBack(): void {
        this.location.back();
    };

    Print(): void {
        window.print();
    };

    private createTableConfig = (data: any) => {
        const tempArr: any[] = [];
        let numberOfOrder: number;
        if (data.length) {
            this.entityData = data.map((item, i) => {
                numberOfOrder = i + 1 + (this.page - 1) * this.limit;
                const groupResult: any = {};
                groupResult.entity_id = item.test_id;
                groupResult.entityColumns = [
                    numberOfOrder,
                    item.student_name,
                    item.result,
                    `${item.resultInPercentage.toFixed(2)}%`,
                    item.resultNational,
                    item.resultECTS];
                return groupResult;
            });
        } else {
            this.noRecords = true;
        }
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    };
}