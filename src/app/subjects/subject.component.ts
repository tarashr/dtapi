import { Component } from '@angular/core';
import { Subject }   from '../shared/classes/subject'

import { OnInit } from '@angular/core';

import { SubjectService }  from '../shared/services/subject.service'

@Component({
    selector: 'subject-container',
    templateUrl: 'subject.component.html',
    styleUrls: ['subject.component.css']
})

export class SubjectComponent implements OnInit {
    subjects: Subject[];

    constructor(private subjectService: SubjectService) { }

    getSubjects(): void {
        this.subjectService.getSubjects().then(subjects => this.subjects = subjects);
    }

    ngOnInit(): void {
        this.getSubjects();
    }

}