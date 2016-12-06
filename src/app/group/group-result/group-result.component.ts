import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Subscription} from "rxjs";

import {CRUDService} from "../../shared/services/crud.service";
import {GroupService} from "../../shared/services/group.service";
import {headersGroupResult, actionsGroupResult} from "../../shared/constant";
import {EntityManagerBody} from "../../shared/classes/entity-manager-body";

@Component({
    templateUrl: "group-result.component.html"
})
export class GroupResultComponent implements OnInit {

    public pageTitle: string;

    public page: number = 1;
    public limit: number = 0;
    public noRecords: boolean = false;

    public subjectEntity: string = "Subject";
    public testEntity: string = "Test";
    public groupEntity: string = "Group";
    public groupId: number;
    public groupName: string;

    public entityData: any[] = [];
    public entityDataWithNames: any ;
    public headers: any = headersGroupResult;
    public actions: any = actionsGroupResult;
    private subscription: Subscription;

    constructor(private _router: Router,
                private route: ActivatedRoute,
                private location: Location,
                private groupService: GroupService,
                private crudService: CRUDService) {
        this.subscription = route.queryParams.subscribe(
            data => {
                this.groupId = data["groupId"];
            });
    };

    ngOnInit() {
        this.createTitle();
        this.getRecords();
    }

    createTitle() {
        this.crudService.getRecordById(this.groupEntity, this.groupId)
            .subscribe(
                data => {
                    this.groupName = data[0].group_name;
                    this.pageTitle = `Перелік тестів зданих групою ${this.groupName}`;
                },
                error => console.log("error: ", error)
            );
    }

    getRecords(): void {
        this.groupService.getTestByGroup(this.groupId)
            .subscribe(
                data => {
                    if (data.response === "no records") {
                        this.noRecords = true;
                    } else {
                        this.noRecords = false;
                        const ids = data.map(item => {
                            return item.test_id;
                        });
                        const entityManagerTests = new EntityManagerBody(this.testEntity, ids);
                        this.getTestsDetails(entityManagerTests);
                    }
                },
                error => console.log("error: ", error)
            );
    }


    getTestsDetails(param: EntityManagerBody): void {
        this.crudService.getEntityValues(param)
            .subscribe(
                data => {
                    this.entityDataWithNames = data;
                    const ids = data.map(item => {
                        return item.subject_id;
                    });
                    const entityManagerSubjects = new EntityManagerBody(this.subjectEntity, ids);
                    this.getSubjectNames(entityManagerSubjects);
                },
                error => console.log("error: ", error)
            );
    }

    getSubjectNames(param: EntityManagerBody): void {
        this.crudService.getEntityValues(param)
            .subscribe(
                data => {
                    this.getNamesByIds(data);
                },
                error => console.log("error: ", error)
            );
    }

    getNamesByIds(data: any): void {
        for (let i in this.entityDataWithNames) {
            for (let k in data) {
                if (this.entityDataWithNames[i].subject_id === data[k].subject_id) {
                    this.entityDataWithNames[i].subject_name = data[k].subject_name;
                }
            }
        }
        this.createTableConfig(this.entityDataWithNames);
    };

    activate(data: any): void {
        switch (data.action) {
            case "viewTestResult":
                this._router.navigate(
                    ["/admin/group/groupTestResult"],
                    {queryParams: {testId: data.entity_id, groupId: this.groupId, subjectId: data.subject_id}}
                );
                break;
        }
    };

    private createTableConfig = (data: any) => {
        let numberOfOrder: number;
        if (data.length) {
            this.entityData = data.map((item, i) => {
                numberOfOrder = i + 1 + (this.page - 1) * this.limit;
                const groupResult: any = {};
                groupResult.entity_id = item.test_id;
                groupResult.subject_id = item.subject_id;
                groupResult.entityColumns = [numberOfOrder, item.subject_name, item.test_name];
                return groupResult;
            });
        } else {
            this.noRecords = true;
        }
    };

    goBack(): void {
        this.location.back();
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    };
}