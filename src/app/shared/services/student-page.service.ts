import {Injectable} from "@angular/core";
import {CRUDService} from "../../shared/services/crud.service";
import {SubjectService} from "../../shared/services/subject.service";
@Injectable()
export class StudentPageService {

    constructor(private _commonService: CRUDService,
                private _subjectService: SubjectService
) {
    }

    getTests(timeTableRecord, entityDataRecord){
        var testRecords =[];
        this._commonService.getRecordById("subject", timeTableRecord.subject_id)
            .subscribe(subject=> {
                var newSubjectName = subject[0].subject_name;
                this._subjectService.getTestsBySubjectId("subject", +timeTableRecord.subject_id)
                    .subscribe(dataTests=> {
                        testRecords = dataTests;
                        for (let j = 0; j < testRecords.length; j++) {
                            if (testRecords[j].enabled === "1") {
                                entityDataRecord.push({
                                    entityColumns: [
                                        newSubjectName,
                                        testRecords[j].test_name,
                                        timeTableRecord.event_date]

                                })
                            }
                        }
                    })

            });
        return entityDataRecord;
    }

    getTimeStamp(miliseconds) {
        var myDate = new Date(miliseconds/10);
        var formatDate = myDate.getFullYear() + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) +
            '-' + ('0' + myDate.getDate()).slice(-2);
        return formatDate;
    }


}