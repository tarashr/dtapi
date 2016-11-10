import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {CRUDService} from "../../shared/services/crud.service";
import {SubjectService} from "../../shared/services/subject.service";

@Component({
    selector: 'test-list',
    templateUrl: './test-list.component.html'
})

export class TestListComponent implements OnChanges {

    @Input() groupId;

    public activeTests = [{
        test_name: "...",
        subject_id: "...",
        subjectName: "...",
        test_id: ""
    }];

    public activeTimeTable = [{
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

    public actions = [
        {
            title: "Запустити тест",
            action: "start",
            glyphicon: "glyphicon glyphicon-play",
            btnClassName: "btn btn-default btn-sm"
        }
    ];

    public entityData = [];


    constructor(private _commonService: CRUDService,
                private _subjectService: SubjectService) {
    }


    ngOnChanges(groupId) {

        if (this.groupId !== undefined) {
            console.log("Group Id=" + this.groupId);

            this.getTimeStamp();
            this.getTimeTable();
        }
    }

    activate(data) {
        console.log(JSON.stringify(data));
    }

    getTimeTable() {
        this.entityData.length = 0;
        this._commonService.getTimeTableForGroup(this.groupId)
            .subscribe(data1=> {this.activeTimeTable = data1;
                   
                for (let i = 0; i < this.activeTimeTable.length; i++) {
                     console.log("timetable="+this.activeTimeTable[i]);
					this._subjectService.getTestsBySubjectId("subject", +this.activeTimeTable[i].subject_id)
                        .subscribe(dataTests=> {
                            this.activeTests = dataTests;
								for (let j = 0; j < this.activeTests.length; j++)
								{
									this.entityData.push({
							entityColumns: [
								this.activeTimeTable[i].subject_id,
								this.activeTests[j].test_name,
								this.activeTimeTable[i].event_date],

								})
								}
							console.log("activeTests="+this.activeTests);
                        })
						
					
                }


                this.entityData.sort(function (a, b) {
                    if (a.entityColumns[1] > b.entityColumns[1]) {return 1;}
                    if (a.entityColumns[1] < b.entityColumns[1]) {return -1;}
                    return 0;
                });

                }
            )
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
