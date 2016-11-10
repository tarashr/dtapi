import {Component, Input, OnChanges} from "@angular/core";
import {Router} from "@angular/router";
import {CRUDService} from "../../shared/services/crud.service";
import {SubjectService} from "../../shared/services/subject.service";
import {StudentPageService} from "../../shared/services/student-page.service";
import {headersStudentTestList, actionsStudentTestList} from "../../shared/constant/student-test-list";

@Component({
    selector: "test-list",
    templateUrl: "./test-list.component.html",
    providers: [StudentPageService]
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



    public headers: any = headersStudentTestList;
    public actions: any = actionsStudentTestList;
    public entityData = [];


    constructor(private _commonService: CRUDService,
                private _router: Router,
                private _studentService: StudentPageService,
                private _subjectService: SubjectService) {
    }


    ngOnChanges(groupId) {

        if (this.groupId !== undefined) {
            this.dateNow = this._studentService.getTimeStamp();

            this.getTimeTable();
        }
    }

    activate(data) {
        this._router.navigate(["/student/test-player"]);
    }

    getTimeTable() {
        this.entityData.length = 0;
        this._commonService.getTimeTableForGroup(this.groupId)
            .subscribe(data=> {
                    this.activeTimeTable = data;

                    for (let i = 0; i < this.activeTimeTable.length; i++) {
                        this._commonService.getRecordById("subject", this.activeTimeTable[i].subject_id)
                            .subscribe(subject=> {
                                var newSubjectName = subject[0].subject_name;
                                this._subjectService.getTestsBySubjectId("subject", +this.activeTimeTable[i].subject_id)
                                    .subscribe(dataTests=> {
                                        this.activeTests = dataTests;
                                        for (let j = 0; j < this.activeTests.length; j++) {
                                            if (this.dateNow == this.activeTimeTable[i].event_date){
                                                this.entityData.push({
                                                    entityColumns: [
                                                        this.activeTests[j].test_name,
                                                        newSubjectName,
                                                        this.activeTimeTable[i].event_date],

                                                })
                                        }
                                        }
                                    })

                            })
                    }
                this.entityData = this._studentService.sortTableData(this.entityData);
                }
            )
    }


}
