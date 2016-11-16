import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Subscription} from "rxjs";

import {GroupService} from "../../shared/services/group.service";
import {EntityManagerBody} from "../../shared/classes/entity-manager-body";
import {headersGroupTestResult} from "../../shared/constant";
import {CRUDService} from "../../shared/services/crud.service";

@Component({
    templateUrl: "group-test-result.component.html"
})
export class GroupTestResultComponent implements OnInit {

    public pageTitle: string = "Результати тестування групи ";

    public page: number = 1;
    public limit: number = 0;
    public noRecords: boolean = false;

    public entityData: any[] = [];
    public entityDataWithNames: any ;
    public headers: any = headersGroupTestResult;

    public testId: number;
    public groupId: number;
    public studentEntity: string = "Student";

    private subscription: Subscription;

    constructor(private location: Location,
                private route: ActivatedRoute,
                private groupService: GroupService,
                private crudService: CRUDService) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.groupId = data["groupId"];
                this.testId = data["testId"];
            });
    };

    ngOnInit() {
        this.getRecords();
    }

    print(): void {
        window.print();
    }

    getRecords(): void {
        this.groupService.getTestResult(this.testId, this.groupId)
            .subscribe(
                data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                    } else {
                        this.entityDataWithNames = data;
                        this.noRecords = false;
                        let ids = [];
                        data.forEach(item => {
                            ids.push(item.student_id);
                        });
                        let entityManagerStudent = new EntityManagerBody(this.studentEntity, ids);
                        this.getStudentName(entityManagerStudent);
                    }
                },
                error => console.log("error: ", error)
            );
    }

    getStudentName(param: EntityManagerBody): void {
        this.crudService.getEntityValues(param)
            .subscribe(
                data => {
                    this.getNamesByIds(data);
                }
            );
    }

    getNamesByIds(data: any): void {
        for (let i in this.entityDataWithNames) {
            for (let k in data) {
                if (this.entityDataWithNames[i].student_id === data[k].user_id) {
                    this.entityDataWithNames[i].student_name = `${data[k].student_surname} ${data[k].student_name}`;
                }
            }
        }
        this.createTableConfig(this.entityDataWithNames);
    }

    goBack(): void {
        this.location.back();
    }

    private createTableConfig = (data: any) => {
        let tempArr: any[] = [];
        let numberOfOrder: number;
        if (data.length) {
            data.forEach((item, i) => {
                numberOfOrder = i + 1 + (this.page - 1) * this.limit;
                let groupResult: any = {};
                groupResult.entity_id = item.test_id;
                groupResult.entityColumns = [numberOfOrder, item.student_name, item.result];
                tempArr.push(groupResult);
            });
            this.entityData = tempArr;
        }
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}