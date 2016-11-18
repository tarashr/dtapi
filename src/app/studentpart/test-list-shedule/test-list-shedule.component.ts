import {Component, OnInit, Input} from "@angular/core";
import {CRUDService} from "../../shared/services/crud.service";
import {SubjectService} from "../../shared/services/subject.service";
import {headersStudentTestList, activeTests, activeTimeTable} from "../../shared/constant/student-test-list";

@Component({
    selector: "test-list-shedule",
    templateUrl: "./test-list-shedule.component.html",

})

export class TestListSheduleComponent implements OnInit {
    @Input() groupId;

    public activeTests: any = activeTests;
    public activeTimeTable: any = activeTimeTable;
    public headers: any = headersStudentTestList;
    public entityData = [];
    public dateNow;
    public dateUser = "";


    constructor(private _commonService: CRUDService,
                private _subjectService: SubjectService) {
    }

    ngOnInit() {
        this.setDate(this.dateUser);
    }

    getTimeTable(startDay, endDay) {
        this.entityData.length = 0;
        
                
                this._commonService.getTimeTableForGroup(this.groupId)
                    .subscribe(data=> {
                            this.activeTimeTable = data;

                            for (let i = 0; i < this.activeTimeTable.length; i++) {
                                                               

                                if ((this.activeTimeTable[i].event_date > startDay)&&
								(this.activeTimeTable[i].event_date <= endDay))

                                {
                                    this._commonService.getRecordById("subject", this.activeTimeTable[i].subject_id)
                                        .subscribe(subject=> {
                                            var newSubjectName = subject[0].subject_name;
                                            this._subjectService.getTestsBySubjectId("subject", +this.activeTimeTable[i].subject_id)
                                                .subscribe(dataTests=> {
                                                    this.activeTests = dataTests;
                                                    for (let j = 0; j < this.activeTests.length; j++) {
                                                        if (this.activeTests[j].enabled) {
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

    setDate(userDay){
        this.dateUser = userDay;
				
		this._commonService.getTime()
            .subscribe(date=> {
                let today = date;
				today = +today.curtime-today.offset;
                this.dateNow = this.getTimeStamp(today);
		
				let startDay = this.dateNow;
				let endDay = this.dateNow;
				switch (this.dateUser) {
					case "tomorrow":
						startDay = this.dateNow;
						endDay = this.getTimeStamp(today + 86400);
						break;
					case "week":
						startDay = this.dateNow;
						endDay = this.getTimeStamp(today + 7*86400);;
						break;
					case "month":
						startDay = this.dateNow;
						endDay = this.getTimeStamp(today + 30*86400);
						break;
					default:
						startDay = this.dateNow;
						endDay = this.getTimeStamp(today + 365*86400);
				}
		
				this.getTimeTable(startDay, endDay);
			});

    }

    getTimeStamp(sec) {
        let mili = +sec * 1000;
        let myDate = new Date(mili);
        let formatDate = myDate.getFullYear() + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) +
            '-' + ('0' + myDate.getDate()).slice(-2);

        return formatDate;
    }

}

