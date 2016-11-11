import {Component, Input, OnChanges} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {CRUDService} from "../../shared/services/crud.service";
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
                private modalService: NgbModal) {
    }


    ngOnChanges(groupId) {
        if (this.groupId) {
            this.getTimeFromServer();
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
                    let countLines = this.activeTimeTable.length;
                    for (let i = 0; i < countLines; i++) {
                        if (this.dateNow === this.activeTimeTable[i].event_date){
                            this.entityData = this._studentService.getTests(
                                this.activeTimeTable[i],
                                this.entityData);
                    }
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

    getTimeFromServer(){
        this._commonService.getTime()
            .subscribe(data=> {
                let today = data;
                today.curtime += today.offset;
                this.dateNow = this._studentService.getTimeStamp(today.curtime);

            })
    }
}
