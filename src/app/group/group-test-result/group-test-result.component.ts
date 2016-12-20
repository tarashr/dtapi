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
    styleUrls: ["group-test-result.component.scss"]
})
export class GroupTestResultComponent implements OnInit {

    public page: number = 1;
    public limit: number = 0;
    public noRecords: boolean = false;
    public entityData: any[] = [];
    public entityDataWithNames: any ;
    public barChartData: any;
    public pieChartData: any;
    public maxResult: number;
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
    public showGraph: boolean = false;

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
                        this.maxResult = +data[0].answers;
                        const ids = data.map(item => {
                            item.resultInPercentage = (+item.result / this.maxResult) * 100;
                            item.resultNational = this.groupService.toNationalRate(item.resultInPercentage);
                            item.resultECTS = this.groupService.toECTSRate(item.resultInPercentage);
                            return item.student_id;
                        });
                        const entityManagerStudent = new EntityManagerBody(this.studentEntity, ids);
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
                    this.entityDataWithNames[i].student_nameWithInitials =
                        `${data[k].student_surname} ${data[k].student_name.slice(0, 1)}. ${data[k].student_fname.slice(0, 1)}.`;
                }
            }
        }
        this.entityDataWithNames.sort((a, b) => {
            return a.student_name.localeCompare(b.student_name);
        });
        this.createChartData();
        this.createTableConfig(this.entityDataWithNames);
    };

    private createTableConfig = (data: any) => {
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

    createChartData() {
        // Data for barChart
        const data: any = {};
        data.series = this.entityDataWithNames.map(item => {
            return +item.resultInPercentage.toFixed(1);
        });
        data.names = this.entityDataWithNames.map(item => {
            return item.student_nameWithInitials;
        });
        this.barChartData = data;

        // Data for pieChart
        this.pieChartData = this.entityDataWithNames.map(item => {
            return item.resultNational;
        });
    }

    changeGraphLable(): string {
        return (this.showGraph) ? "Список" : "Графіки";
    };

    Print(): void {
        window.print();
    };

    goBack(): void {
        this.location.back();
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    };
}