import {Component, OnInit, Input} from "@angular/core";
import {CRUDService} from "../../shared/services/crud.service";
import {StudentPageService} from "../../shared/services/student-page.service";
import {headersStudentTestList, activeTests, activeTimeTable} from "../../shared/constant/student-test-list";

@Component({
    selector: "test-list-shedule",
    templateUrl: "./test-list-shedule.component.html",
    providers: [StudentPageService]
})

export class TestListSheduleComponent implements OnInit {
    @Input() groupId;


    public activeTests: any = activeTests;
    public activeTimeTable: any = activeTimeTable;
    public dateNow;



    public headers: any = headersStudentTestList;
    public entityData = [];


    constructor(private _commonService: CRUDService,
                private _studentService: StudentPageService) {
    }

    ngOnInit() {

        this.getTimeFromServer();
        this.getTimeTable();

    }

    getTimeTable() {
        this.entityData.length = 0;
        this._commonService.getTimeTableForGroup(this.groupId)
            .subscribe(data1=> {
                    this.activeTimeTable = data1;

                    for (let i = 0; i < this.activeTimeTable.length; i++) {
                        if (this.dateNow < this.activeTimeTable[i].event_date) {
                            this.entityData = this._studentService.getTests(
                                this.activeTimeTable[i],
                                this.entityData);
                        }
                    }
                }
            )
    }

    getTimeFromServer(){
        this._commonService.getTime()
            .subscribe(data=> {
                let today = data;
                today.curtime += today.offset;
                this.dateNow = this._studentService.getTimeStamp(today.curtime);
            })
    }
}

