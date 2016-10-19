import {Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, SimpleChanges} from '@angular/core';
import {OnInit} from '@angular/core';
import '../shared/rxjs-operators';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

import {Subject}   from '../shared/classes/subject';
import {SubjectService}  from '../shared/services/subject.service';
import {subscribeOn} from "rxjs/operator/subscribeOn";

@Component({
    selector: 'subject-container',
    templateUrl: 'subject.component.html',
    styleUrls: ['subject.component.css']
})

export class SubjectComponent implements OnInit, OnChanges {

    public _pageCount = 0;

    public subjects: Subject[];
    public errorMessage: string;
    public pageTittle: string = 'Предмети';
    public limit: number = 5;
    public totalSubjects: number;
    public currentpage: number = 0;
    public pages: number[] = [];
    public offset: number = 0;
    public maxSize: number = 5;

    pageChange(number) {
    };

    // @Output() pageChange = new EventEmitter<number>(true);

    constructor(private subjectService: SubjectService) {
    }

    ngOnInit(): void {
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

    // pageChange(number){
    //
    // }

    changeLimit() {
        console.log(this.limit);
        this.limit = 5 || 10 || 15;
        this.getSubjectRange();
    };

    //Pagination

    get pageCount(): number {
        return this._pageCount;
    };

    selectPage(pageNumber: number): void {
        this._setPageInRange(pageNumber);
        this.ngOnChanges(null);
    }

    ngOnChanges(changes: SimpleChanges): void {

        this._pageCount = Math.ceil(this.totalSubjects / this.limit);

        // fill-in model needed to render pages
        this.pages.length = 0;
        for (let i = 1; i <= this._pageCount; i++) {
            this.pages.push(i);
        }

        // set page within 1..max range
        this._setPageInRange(this.currentpage);

    }

    private _applyPagination(): [number, number] {
        let page = Math.ceil(this.currentpage / this.maxSize) - 1;
        let start = page * this.maxSize;
        let end = start + this.maxSize;

        return [start, end];
    }

    private _setPageInRange(newPageNo) {
        const prevPageNo = this.currentpage;
        this.currentpage = this.getValueInRange(newPageNo, this._pageCount, 1);

        if (this.currentpage !== prevPageNo) {
            this.pageChange(this.currentpage);
            // this.offset = this.currentpage * this.limit;
            // this.getSubjectRange();
          this.pageChange(this.currentpage)
            {
                this.offset = this.currentpage * this.limit;
                this.getSubjectRange();
            }
        }
    }

    private getValueInRange(value: number, max: number, min = 0): number {
        return Math.max(Math.min(value, max), min);
    }

}


