import {Component, Input, OnChanges} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {CRUDService} from "../../shared/services/crud.service";
import {SubjectService} from "../../shared/services/subject.service";
import {InfoModalComponent} from "../../shared/components/info-modal/info-modal.component";
import {
    headersStudentTestList,
    actionsStudentTestList,
    activeTests,
    activeTimeTable
} from "../../shared/constant/student-test-list";
import {modalInfoConfig} from "../../shared/constant";


@Component({
    selector: "test-list",
    templateUrl: "./test-list.component.html",
})

export class TestListComponent implements OnChanges {

    @Input() groupId;


    public modalInfoConfig: any = modalInfoConfig;

    public activeTests: any = activeTests;
    public activeTimeTable: any = activeTimeTable;

    public dateNow = {date:"", time:""};
    public countOfTests: number = 0;

    public headers: any = headersStudentTestList;
    public actions: any = actionsStudentTestList;
    public entityData = [];
	public userRole = sessionStorage.getItem("userRole");
	
    constructor(private _commonService: CRUDService,
                private _router: Router,
                private _subjectService: SubjectService,
                private modalService: NgbModal) {
    }

    ngOnChanges() {
        if (this.groupId) {
            this.getTimeTable();

        }


    }


    activate(data) {
        this.runTest(data);
    }

    getTimeTable() {
        this.entityData.length = 0;
        this._commonService.getTime()
            .subscribe(date=> {
                let today = date;
                this.dateNow = this.getTimeStamp(+today.curtime - today.offset);

                this._commonService.getTimeTableForGroup(this.groupId)
                    .subscribe(data => {
                        this.activeTimeTable = data;

                        for (let i = 0; i < this.activeTimeTable.length; i++) {
                            let testStartDate = this.activeTimeTable[i].start_date;
                            let testStartTime = this.activeTimeTable[i].start_time;

                            if (this.dateNow.date === testStartDate) {
                                this.getTestsForToday(
                                    this.activeTimeTable[i].subject_id,
                                    testStartDate
                                );
                            }


                        }
                    });


            });
    }

    getTestsForToday(subId, eventDate) {
        this._commonService.getRecordById("subject", subId)
            .subscribe(subject => {
                let newSubjectName = subject[0].subject_name;
                this._subjectService.getTestsBySubjectId("subject", +subId)
                    .subscribe(dataTests => {
                        this.activeTests = dataTests;
                        for (let j = 0; j < this.activeTests.length; j++) {
                            if (this.activeTests[j].enabled === "1") {
                                this.countOfTests++;
                                this.entityDataPush(
                                    newSubjectName,
                                    this.activeTests[j].test_name,
                                    eventDate,
                                    this.activeTests[j].test_id
                                );
                            }
                        }

                    });

            });
    }

    entityDataPush(subName, testName, eventDate, testId) {
        this.entityData.push({
                entityColumns: [
                    subName,
                    testName,
                    eventDate],
                entity_id: testId
            }
        )
    }


    runTest(data: any) {
        this.modalInfoConfig.infoString = "Ви дійсно хочете пройти тест:\n" + data.entityColumns[1] + "?";
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Початок тестування";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this._router.navigate(["/student/test-player"],
                    {queryParams: {testId: data.entity_id}}
                );
            }, () => {
                return;
            });
    }

    getTimeStamp(mili) {
        mili = +mili * 1000;
        let myDate = new Date(mili);

        let formatDate = {
            date: myDate.getFullYear() + "-" + ("0" + (myDate.getMonth() + 1)).slice(-2) +
            "-" + ("0" + myDate.getDate()).slice(-2),

            time: ("0" + (myDate.getHours() + 1)).slice(-2) + "-" + ("0" + (myDate.getMinutes() + 1)).slice(-2) +
            "-" + ("0" + myDate.getSeconds()).slice(-2)
        };

        return formatDate;
    }

}