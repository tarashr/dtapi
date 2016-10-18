import {Component, OnInit} from '@angular/core';
import {CommonService} from "../shared/services/common.service";
import {Router} from "@angular/router";

class Entity {
    name:string;
    count: any;
    nameForIteration: string;
}

@Component({
    templateUrl: 'statistic.component.html',
    styleUrls: ['statistic.component.css']
})
export class StatisticComponent implements OnInit {

    public entities: Entity[]=[
        {
            name:"faculty",
            count:0,
            nameForIteration:"факультетів"
        },
        {
            name:"speciality",
            count:0,
            nameForIteration:"спеціальностей"
        },
        {
            name:"group",
            count:0,
            nameForIteration:"груп"
        },
        {
            name:"student",
            count:0,
            nameForIteration:"студентів"
        },
        {
            name:"subject",
            count:0,
            nameForIteration:"предметів"
        },
        {
            name:"test",
            count:0,
            nameForIteration:"тестів"
        }
    ];

    constructor(private _commonService:CommonService,
                private _router:Router) {
    }

    ngOnInit() {
        let userRole:string = sessionStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this._router.navigate(["/login"]);
        }
        this.entities.forEach((entity)=>{
            this._commonService.getCountRecords(entity.name)
                .subscribe(data => {
                    entity.count = data.numberOfRecords;
                    localStorage.setItem(entity.name, (entity.count as string));
                });
        });
    }
}