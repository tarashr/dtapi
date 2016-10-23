import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import '../shared/rxjs-operators';
import {Router} from "@angular/router";
import {Subject}   from '../shared/classes/subject';
import {SubjectService}  from '../shared/services/subject.service';

@Component({
    selector: 'subject-container',
    templateUrl: 'subject.component.html',
    styleUrls: ['subject.component.css']
})

export class SubjectComponent implements OnInit {

    public subjects: Subject[];
    public errorMessage: string;
    public pageTittle: string = "Предмети";
    public limit: number = 5;
    public totalSubjects: number;
    public currentPage: number = 1;
    public offset: number = 0;
    public maxSize: number = 5;
    public searchCriteria: string;
    public create = "create";
    public edit = "edit";
    public titleForEdit = "Редагувати дані предмету";
    public titleForNew = "Створити новий предмет";
    public hiddenForSearch = false;
    public disabledForSearch:any = 0;


    constructor(private subjectService: SubjectService,
                private _router: Router) {
    }

    ngOnInit() {
        let userRole: string = sessionStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this._router.navigate(["/login"]);
        }

        this.getcountSubjects();
    }

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
                        this.refreshData(data);
                        return true;
                    },
                    error => this.errorMessage = <any>error
                );
        }
    }

    getcountSubjects() {
        this.subjectService.getcountSubjects()
            .subscribe(
                res => {
                    this.totalSubjects = +res.numberOfRecords;
                    this.getSubjectsRange();
                },
                error => this.errorMessage = <any>error
            );
    }

    getSubjectsRange(): void {
        this.subjectService.getSubjectsRange(this.limit, this.offset)
            .subscribe(
                res => {
                    this.subjects = res;
                },
                error => this.errorMessage = <any>error
            );
    }

    changeLimit($event) {
        console.log($event.currentTarget.value);
        this.limit = $event.currentTarget.value;
        this.offset = 0;
        this.currentPage = 1;
        this.getSubjectsRange();
    }

    pageChange(num: number) {
        if (!num) {
            num = 1
        }
        this.currentPage = num;
        this.offset = (this.currentPage - 1) * this.limit;
        this.getSubjectsRange();
    }

    getSubjectsBySearch(): void {
        this.subjectService.getSubjectsbySearch(this.searchCriteria)
            .subscribe(
                res => {
                    if(res.response === "no records") this.subjects = [];
                    if(res.length) this.subjects = res;
                    console.log(this.subjects);
                },
                error => this.errorMessage = <any>error
            )
    }

    searchForData($event) {
        this.searchCriteria = $event.currentTarget.value;
        if (this.searchCriteria) {
            this.hiddenForSearch = true;
            this.disabledForSearch = "disabled";
            this.getSubjectsBySearch();
        }
        else if(!this.searchCriteria) {
            this.hiddenForSearch = false;
            this.disabledForSearch = 0;
            this.getcountSubjects();
        }
    }

    refreshData(data: string) {
        if (this.subjects.length === 1) {
            this.offset = (this.currentPage - 2) * this.limit;
            this.currentPage -= 1;
        } else if (this.subjects.length > 1) {
            this.offset = (this.currentPage - 1) * this.limit;
        }
        this.getcountSubjects();
    }


}

