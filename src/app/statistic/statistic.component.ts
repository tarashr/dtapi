import {Component, OnInit} from '@angular/core';
import {CRUDService} from "../shared/services/crud.service";
import {Router} from "@angular/router";
import {StatisticData} from "../shared/classes/statistic-data";
import {entities} from "../shared/constants";

@Component({
    templateUrl: 'statistic.component.html',
    styleUrls: ['statistic.component.css']
})
export class StatisticComponent implements OnInit {

    public entities:StatisticData[] = entities;


    constructor(private crudService:CRUDService,
                private router:Router) {
    }

    ngOnInit() {
        this.entities.forEach((entity)=> {

            this.crudService.getCountRecords(entity.name)

            this.crudService.getCountRecords(entity.name)

                .subscribe(data => {
                    entity.count = data.numberOfRecords;
                });
        });
    }
}