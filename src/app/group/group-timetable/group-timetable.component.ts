import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Location} from '@angular/common';

import {GroupService} from "../../shared/services/group.service";
import {headersGroupTimeTable,
        actionsGroupTimeTable} from "../../shared/constant";
@Component({
    templateUrl: "group-timetable.component.html"
})
export class GroupTimetableComponent implements OnInit {

    public pageTitle: string = "Розклад тестування для групи: ";
    public entityData: any[] = [];
    public groupId: number;
    public page: number = 1;
    public limit: number = 0;
    public headers: any = headersGroupTimeTable;
    public actions: any = actionsGroupTimeTable;


    constructor(private router: Router,
                private groupService: GroupService,
                private location: Location) {
    };

    ngOnInit() {
        this.groupService.getTimeTablesForGroup(this.groupId);
    }

    private createTableConfig = (data: any) => {
        let tempArr: any[] = [];
        let numberOfOrder: number;
        data.forEach((item, i) => {
            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
            let groupTimetable: any = {};
            groupTimetable.entity_id = item.group_id;
            groupTimetable.entityColumns = [numberOfOrder, item.event_date, item.subject_id];
            tempArr.push(groupTimetable);
        });
        this.entityData = tempArr;
    };

    goBack(): void {
        this.location.back();
    }

    activate(data: any) {
        switch (data.action) {
            case "edit":
                this.editCase(data);
                break;
            case "delete":
                this.deleteCase(data);
                break;
            case "create":
                this.createCase();
                break;
        }
    }

    createCase() {}

    deleteCase(data) {}

    editCase(data) {}
}