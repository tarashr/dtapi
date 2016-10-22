import {Component, OnInit} from '@angular/core';
import {CommonService} from "../shared/services/common.service";
import {Router} from "@angular/router";
import {StatisticData} from "../shared/classes/statistic-data";


@Component({
    templateUrl: 'statistic.component.html',
    styleUrls: ['statistic.component.css']
})
export class StatisticComponent implements OnInit {

    public entities:StatisticData[] = [
        {
            name: "faculty",
            count: "-",
            nameForIteration: "факультетів"
        },
        {
            name: "speciality",
            count: "-",
            nameForIteration: "спеціальностей"
        },
        {
            name: "group",
            count: "-",
            nameForIteration: "груп"
        },
        {
            name: "student",
            count: "-",
            nameForIteration: "студентів"
        },
        {
            name: "subject",
            count: "-",
            nameForIteration: "предметів"
        },
        {
            name: "test",
            count: "-",
            nameForIteration: "тестів"
        }
    ];

    constructor(private _commonService:CommonService,
                private _router:Router) {
    }

    ngOnInit() {
        this.entities.forEach((entity)=> {
            this._commonService.getCountRecords(entity.name)
                .subscribe(data => {
                    entity.count = data.numberOfRecords;
                    localStorage.setItem(entity.name, (entity.count as string));
                });
        });

    }
}