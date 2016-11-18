import {Component, OnInit} from "@angular/core";
import {CRUDService} from "../shared/services/crud.service";
import {StatisticData} from "../shared/classes/statistic-data";
import {entities} from "../shared/constant";

@Component({
    templateUrl: "statistic.component.html",
    styleUrls: ["statistic.component.css"]
})
export class StatisticComponent implements OnInit {

    public entities: StatisticData[] = entities;


    constructor(private crudService: CRUDService) {
    }

    ngOnInit() {
        this.entities.forEach((entity) => {
            this.crudService.getCountRecords(entity.name)
                .subscribe(data => {
                    entity.count = data.numberOfRecords;
                });
        });
    }
}