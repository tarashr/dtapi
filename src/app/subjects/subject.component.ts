import {Component, Input, Output, EventEmitter} from '@angular/core';
import { OnInit } from '@angular/core';
import '../shared/rxjs-operators';

import { Subject }   from '../shared/classes/subject';
import { SubjectService }  from '../shared/services/subject.service';

@Component({
    selector: 'subject-container',
    templateUrl: 'subject.component.html',
    styleUrls: ['subject.component.css']
})

export class SubjectComponent implements OnInit {

    public subjects:Subject[];
    errorMessage:string;
    pageTittle:string = 'Предмети';

    constructor(
        private subjectService: SubjectService
    ){}

    ngOnInit():void {
        this.getSubjects();
    }

    /////methods///////
    getSubjects():void {
        this.subjectService.getSubjects()
            .subscribe(
                subjects => this.subjects = subjects,
                error => this.errorMessage = <any>error
            );
    }

    deleteSubject(subject: Subject): void {
        if (confirm('Should I delete subject')) {
            this.subjectService
                .deleteSubject(subject.subject_id)
                .subscribe(
                    data => {
                        this.getSubjects();
                        return true;
                    },
                    error => this.errorMessage = <any>error
                );
        }
    }

}