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
    public dateNow;



    public headers: any = headersStudentTestList;
    public entityData = [];


    constructor(private _commonService: CRUDService,
                private _studentService: StudentPageService,
                private _subjectService: SubjectService) {
    }

    ngOnInit() {

        this.dateNow = this._studentService.getTimeStamp();
        this.getTimeTable();

    }

    getTimeTable() {
        this.entityData.length = 0;
        this._commonService.getTimeTableForGroup(this.groupId)
            .subscribe(data1=> {
                    this.activeTimeTable = data1;

                    for (let i = 0; i < this.activeTimeTable.length; i++) {
					if (this.dateNow < this.activeTimeTable[i].event_date){
                        this._commonService.getRecordById("subject", this.activeTimeTable[i].subject_id)
                            .subscribe(subject=> {
                                var newSubjectName = subject[0].subject_name;
                                this._subjectService.getTestsBySubjectId("subject", +this.activeTimeTable[i].subject_id)
                                    .subscribe(dataTests=> {
                                        this.activeTests = dataTests;
                                        for (let j = 0; j < this.activeTests.length; j++) {
                                            if (this.activeTests[j].enabled === "1"){
                                                this.entityData.push({
                                                    entityColumns: [
                                                        newSubjectName,
                                                        this.activeTests[j].test_name,
                                                        this.activeTimeTable[i].event_date]
                                                })
                                            }
                                        }
                                    })
                            })
							}
                    }
                }
            )
    }

}

