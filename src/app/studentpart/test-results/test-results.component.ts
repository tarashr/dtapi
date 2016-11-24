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
	providers : [StudentPageService]
})

export class StudentTestResultsComponent implements OnInit {

	public userId:number = +sessionStorage.getItem("userId");
	
    public activeTests: any = activeTests;
    public activeTimeTable: any = activeTimeTable;
    public headers: any = headersStudentTestResults;
    public entityData = [];
    public dateNow;
    public dateUser = "";


    constructor(private _commonService: CRUDService,
                private _studentService: StudentPageService) {
    }

    ngOnInit() {
       
    }
}