import {Component, OnInit, Input} from "@angular/core";
import {CRUDService} from "../../shared/services/crud.service";
import {SubjectService} from "../../shared/services/subject.service";
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
    public headers: any = headersStudentTestList;
    public entityData = [];
    public dateNow;
    public dateUser = "today";


    constructor(private _commonService: CRUDService,
                private _subjectService: SubjectService,
                private _studentService: StudentPageService) {
    }

    ngOnInit() {
        this.setDate(this.dateUser);
    }

    getTimeTable(startDay, endDay) {
        this.entityData.length = 0;
        this._commonService.getTimeTableForGroup(this.groupId)
            .subscribe(data => {
                    this.activeTimeTable = data;
                    for (let i = 0; i < this.activeTimeTable.length; i++) {
                        if ((this.activeTimeTable[i].start_date >= startDay) &&
                            (this.activeTimeTable[i].start_date <= endDay) && !(startDay === this.dateNow.date &&
                            (this.activeTimeTable[i].start_time <= this.dateNow.time &&
                            this.activeTimeTable[i].end_time >= this.dateNow.time))
                        ) {
                            this._commonService.getRecordById("subject", this.activeTimeTable[i].subject_id)
                                .subscribe(subject => {
                                    let newSubjectName = subject[0].subject_name;
                                    this._subjectService.getTestsBySubjectId("subject", +this.activeTimeTable[i].subject_id)
                                        .subscribe(dataTests => {
                                            this.activeTests = dataTests;
                                            for (let j = 0; j < this.activeTests.length; j++) {
                                                if (this.activeTests[j].enabled === "1") {
                                                    this.entityData.push({
                                                        entityColumns: [
                                                            newSubjectName + ": " +
                                                            this.activeTests[j].test_name,
                                                            this.activeTimeTable[i].start_date.replace(/(\d+)-(\d+)-(\d+)/, '$3-$2-$1') + " / " +
                                                            this.activeTimeTable[i].start_time,
                                                            this.activeTimeTable[i].end_date.replace(/(\d+)-(\d+)-(\d+)/, '$3-$2-$1') + " / " +
                                                            this.activeTimeTable[i].end_time,
                                                            this.activeTests[j].tasks,
                                                            this.activeTests[j].time_for_test]
                                                    });
                                                }
                                            }
                                        });
                                });
                        }
                    }
                }
            );

    }

    setDate(userDay) {
        this.dateUser = userDay;

        this._commonService.getTime()
            .subscribe(date=> {
                let today = date;
                today = +today.curtime - today.offset;
                this.dateNow = this._studentService.getTimeStamp(today);

                let startDay = this.dateNow.date;
                let endDay = this.dateNow.date;
                switch (this.dateUser) {
                    case "today":
                        startDay = this.dateNow.date;
                        endDay = this.dateNow.date;
                        break;
                    case "tomorrow":
                        startDay = this._studentService.getTimeStamp(today + 86400).date;
                        endDay = this._studentService.getTimeStamp(today + 86400).date;
                        break;
                    case "week":
                        startDay = this._studentService.getTimeStamp(today + 86400).date;
                        endDay = this._studentService.getTimeStamp(today + 7 * 86400).date;
                        break;
                    case "month":
                        startDay = this._studentService.getTimeStamp(today + 86400).date;
                        endDay = this._studentService.getTimeStamp(today + 30 * 86400).date;
                        break;
                    default:
                        startDay = this._studentService.getTimeStamp(today + 86400).date;
                        endDay = this._studentService.getTimeStamp(today + 365 * 86400).date;
                }

                this.getTimeTable(startDay, endDay);
            });

    }


}

