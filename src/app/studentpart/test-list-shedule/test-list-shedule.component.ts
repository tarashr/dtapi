import {Component, OnInit, Input} from '@angular/core';
import {CRUDService} from "../../shared/services/crud.service";
import {SubjectService} from "../../shared/services/subject.service";

@Component({
    selector: 'test-list-shedule',
    templateUrl: './test-list-shedule.component.html'
})

export class TestListSheduleComponent implements OnInit {
    @Input() groupId;

    public tests = [{
        test_name: "...",
        subject_id: "...",
        subjectName: "...",
        test_id: ""
    }];

    public timeTable = [{
        group_id: this.groupId,
        subject_id: "",
        event_date: ""
    }];


    public dateNow = "";

    public headers = [
        // {name: "№", className: "col-xs-12 col-sm-1"},
        {name: "Предмет", className: "col-xs-12 col-sm-4"},
        {name: "Назва тесту", className: "col-xs-12 col-sm-4"},
        {name: "Дата", className: "col-xs-12 col-sm-3"},
        {name: "", className: "col-xs-12 col-sm-1"}
    ];


    public entityData = [];


    constructor(private _commonService: CRUDService,
                private _subjectService: SubjectService) {
    }

    ngOnInit() {

        this.getTimeStamp();
        this.getTimeTable();

    }

    getTimeTable() {
        this.timeTable.length = 0;
        this.tests.length = 0;
        this._commonService.getTimeTableForGroup(this.groupId)
            .subscribe(data=> {
                this.timeTable = data;

                for (let i = 0; i < this.timeTable.length; i++) {
                    let idSubject = +this.timeTable[i].subject_id;
                    let eventDate = this.timeTable[i].event_date;
                    this._subjectService.getTestsBySubjectId("subject", idSubject)
                        .subscribe(data=> {
                            this.tests = data;
                            this.getTestList(eventDate);
                        })
                }
            })
    }

    getTestList(eventDate) {

        for (let i = 0; i < this.tests.length; i++) {
            this._commonService.getRecordById("subject", this.tests[i].subject_id)
                .subscribe(subject=> {
                        this.tests[i].subjectName = subject[0].subject_name;
                        if (eventDate > this.dateNow) {
                            this.entityData.push({
                                entityColumns: [
                                    subject[0].subject_name,
                                    this.tests[i].test_name,
                                    eventDate],
                                entity_id: this.tests[i].test_id
                            })
                        }

                        this.entityData.sort(function (a, b) {
                            if (a.entityColumns[1] > b.entityColumns[1]) {
                                return 1;
                            }
                            if (a.entityColumns[1] < b.entityColumns[1]) {
                                return -1;
                            }
                            return 0;
                        });

                    }
                )
        }
    }

    getTimeStamp() {

        var myDate = new Date();
        var yy = myDate.getFullYear();
        var mm = myDate.getMonth()+1;
        var dd = "0"+myDate.getDate();
        this.dateNow = yy + "-" + mm + "-" + dd;
        /*     this._commonService.getTime()
         .subscribe(time=> {
         this.dateNow = time;
         this.dateNow.curtime += +this.dateNow.offset;
         console.log("this.dateNow.curtime = " + this.dateNow.curtime);
         var newTime = new Date(this.dateNow.curtime);
         var myDate = newTime.getFullYear() + "-" + newTime.getMonth() + "-" + newTime.getDate();
         console.log("time = " + newTime);
         console.log("my time = " + myDate)
         })*/
    }

}
