import {Component, OnInit} from '@angular/core';
import {Faculty} from "../shared/classes/faculty";
import {CommonService} from "../shared/services/common.service";

@Component({
    templateUrl: 'faculty.component.html',
    styleUrls: ['faculty.component.css'],
    providers: [CommonService]
})
export class FacultyComponent implements OnInit {

    public faculties:Faculty[];
    public entity:string = "faculty";

    constructor(private _commonService:CommonService) {
    }

    getRecords():void {
        this._commonService.getRecords(this.entity)
            .then(data => this.faculties = data);
    }

    delRecord(entity:string, id:number) {
        this._commonService.delRecord(entity, id);
        this.getRecords();
    }

    ngOnInit() {
        this.getRecords()
    }
}