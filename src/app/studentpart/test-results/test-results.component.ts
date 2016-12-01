import {Component, OnInit} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {CRUDService} from "../../shared/services/crud.service";
import {StudentPageService} from "../../shared/services/student-page.service";

import {
    headersStudentTestResults,
    activeTests,
    activeTimeTable
} from "../../shared/constant/student-test-list";


@Component({
    selector: "test-results",
    templateUrl: "./test-results.component.html",
    providers: [StudentPageService]
})

export class StudentTestResultsComponent implements OnInit {

    public userId: number = +sessionStorage.getItem("userId");

    public activeTests: any = activeTests;
    public activeTimeTable: any = activeTimeTable;
    public headers: any = headersStudentTestResults;
    public entityData = [];
    public dateNow;
    public dateUser = "";

    public testResults;

    constructor(private _commonService: CRUDService,
                private _studentService: StudentPageService) {
    }

    ngOnInit() {
        let userId: number = +sessionStorage.getItem("userId");
        this.getStudentResults(userId);
    }

    getStudentResults(userId: number) {
        this._studentService.getStudentTestResults(userId)
            .subscribe(data=> {
                const testResult = data;
                for (let i = 0; i < testResult.length; i++) {
                    this._commonService.getRecordById("Test", testResult[i].test_id)
                        .subscribe(dataTests => {

                            const testResults = dataTests[0];
                            this.entityData.push({
                                entityColumns: [
                                    testResults.test_name,
                                    testResult[i].session_date.replace(/(\d+)-(\d+)-(\d+)/, '$3-$2-$1') + " ( з " +
                                    testResult[i].start_time + " до " +
                                    testResult[i].end_time + ")",
                                    (testResult[i].result / testResult[i].answers * 100).toFixed(2) + "% (" +
                                    testResult[i].result + " з " +
                                    testResult[i].answers + ")"]
                            });

                        });
                }
            });
    }
}