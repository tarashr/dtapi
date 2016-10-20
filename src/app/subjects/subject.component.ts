import {Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, SimpleChanges} from '@angular/core';
import {OnInit} from '@angular/core';
import '../shared/rxjs-operators';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";
import {Subject}   from '../shared/classes/subject';
import {SubjectService}  from '../shared/services/subject.service';
import {CommonService} from "../shared/services/common.service";


@Component({
    selector: 'subject-container',
    templateUrl: 'subject.component.html',
    styleUrls: ['subject.component.css']
})

export class SubjectComponent implements OnInit {

    // public _pageCount = 0;

    public subjects: Subject[];
    public errorMessage: string;
    public pageTittle: string = 'Предмети';
    public limit: number = 5;
    public totalSubjects: number;
    public currentpage: number = 1;
    // public pages: number[] = [];
    public offset: number = 0;
    public maxSize: number = 5;
    // public options: number[] = [5, 10, 15];




    constructor(
        private subjectService: SubjectService,
        private _router:Router
    ) { }

    ngOnInit() {
        let userRole:string = sessionStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this._router.navigate(["/login"]);
        }
        this.totalSubjects = Number(localStorage.getItem('subjects'));
        this.getSubjectRange();
        this.getcountSubjects();
    }

    /////methods///////
    getSubjects(): void {
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

    getcountSubjects() {
        this.subjectService.getcoutSubjects()
            .subscribe(
                res => {
                    res = +res.numberOfRecords;
                    this.totalSubjects = res;
                    console.log(this.totalSubjects);
                },
                error => this.errorMessage = <any>error
            );
    }

    getSubjectRange(): void {
        this.subjectService.getSubjectsRange(this.limit, this.offset)
            .subscribe(
                res => {
                    this.subjects = res;
                    console.log(this.subjects);
                },
                error => this.errorMessage = <any>error
            );

    }

    changeLimit() {
        this.offset = 0;
        this.currentpage = 1;
        setTimeout(()=> {
            this.subjectService.getSubjectsRange(this.limit, this.offset)
                .subscribe(data => this.subjects = data);
        }, 0);
    }

    pageChange(num: number) {
        this.currentpage = num;
        this.offset = (this.currentpage - 1) * this.limit;
        this.getSubjectRange();
    }
}

