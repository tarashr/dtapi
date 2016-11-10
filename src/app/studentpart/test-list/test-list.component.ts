import {Component, Input, OnChanges} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {CRUDService} from "../../shared/services/crud.service";
import {SubjectService} from "../../shared/services/subject.service";
import {InfoModalComponent} from "../../shared/components/info-modal/info-modal.component";
import {StudentPageService} from "../../shared/services/student-page.service";
import {headersStudentTestList, actionsStudentTestList,activeTests, activeTimeTable} from "../../shared/constant/student-test-list";
import {modalInfoConfig
} from "../../shared/constant";
import {isBoolean} from "util";

@Component({
    selector: "test-list",
    templateUrl: "./test-list.component.html",
    providers: [StudentPageService]
})

export class TestListComponent implements OnChanges {

    @Input() groupId;

    public modalInfoConfig: any = modalInfoConfig;

    public activeTests: any = activeTests;
    public activeTimeTable: any = activeTimeTable;

    public dateNow;



    public headers: any = headersStudentTestList;
    public actions: any = actionsStudentTestList;
    public entityData = [];


    constructor(private _commonService: CRUDService,
                private _router: Router,
                private _studentService: StudentPageService,
                private _subjectService: SubjectService,
                private modalService: NgbModal) {
    }


    ngOnChanges(groupId) {

        if (this.groupId !== undefined) {
            this.dateNow = this._studentService.getTimeStamp();

            this.getTimeTable();
        }
    }

    activate(data) {
        this.runTest(data);
    }

    getTimeTable() {
        this.entityData.length = 0;
        this._commonService.getTimeTableForGroup(this.groupId)
            .subscribe(data=> {
                    this.activeTimeTable = data;

                    for (let i = 0; i < this.activeTimeTable.length; i++) {
                        let dateSuccsess = (this.dateNow === this.activeTimeTable[i].event_date);
                        this._commonService.getRecordById("subject", this.activeTimeTable[i].subject_id)
                            .subscribe(subject=> {
                                var newSubjectName = subject[0].subject_name;
                                this._subjectService.getTestsBySubjectId("subject", +this.activeTimeTable[i].subject_id)
                                    .subscribe(dataTests=> {
                                        this.activeTests = dataTests;
                                        for (let j = 0; j < this.activeTests.length; j++) {
                                            if (dateSuccsess && this.activeTests[j].enabled === "1"){
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
            )
    }

    runTest(data: any) {
        this.modalInfoConfig.infoString = "Ви дійсно хочете пройти тест:\n" + data.entityColumns[1]+"?";
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Початок тестування";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this._router.navigate(["/student/test-player"]);
            }, () => {
                return;
            });
    }

}
