import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import '../shared/rxjs-operators';
import {Router} from "@angular/router";
import {Subject}   from '../shared/classes/subject';
import {CRUDService}  from '../shared/services/crud.service';

@Component({
    selector: 'subject-container',
    templateUrl: 'subject.component.html'
    })

export class SubjectComponent implements OnInit {

    //common variables
    public pageTittle: string = "Предмети";
    public entity:string = "subject";
    public subjects: Subject[];
    public errorMessage: string;

    //variables for pagination
    public limit: number = 5;
    public totalSubjects: number;
    public currentPage: number = 1;
    public offset: number = 0;
    public maxSize: number = 5;

    //variables for search
    public searchCriteria: string;

    //varibles for addedit
    public create = "create";
    public edit = "edit";
    public titleForEdit = "Редагувати дані предмету";
    public titleForNew = "Створити новий предмет";

    constructor(
        private crudService: CRUDService
    ) {}

    ngOnInit() {
        this.getCountSubjects();
    }

    deleteSubject(subject: Subject): void {
        if (confirm('Підтвердіть видалення предмету')) {
            this.crudService
                .delRecord(this.entity, subject.subject_id)
                .subscribe(
                    data => {
                        this.refreshData(data);
                        return true;
                    },
                    error => this.errorMessage = <any>error
                );
        }
    }

    getCountSubjects() {
        this.crudService.getCountRecords(this.entity)
            .subscribe(
                res => {
                    this.totalSubjects = +res.numberOfRecords;
                    this.getSubjectsRange();
                },
                error => this.errorMessage = <any>error
            );
    }

    getSubjectsRange(): void {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
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
            this.currentPage = 1;
            return;
        }
        this.currentPage = num;
        this.offset = (this.currentPage - 1) * this.limit;
        this.getSubjectsRange();
    }

    getSubjectsBySearch(): void {
        this.crudService.getRecordsBySearch(this.entity, this.searchCriteria)
            .subscribe(
                res => {
                    if(res.response === "no records") this.subjects = [];
                    if(res.length) this.subjects = res;
                },
                error => this.errorMessage = <any>error
            )
    }

    searchForData($event) {
        this.searchCriteria = $event.currentTarget.value;
        if (this.searchCriteria) {
            this.getSubjectsBySearch();
        }
        else if (!this.searchCriteria) {
            this.getCountSubjects();
        }
    }

    refreshData(data: string) {
        if (this.subjects.length === 1) {
            this.offset = (this.currentPage - 2) * this.limit;
            this.currentPage -= 1;
        } else if (this.subjects.length > 1) {
            this.offset = (this.currentPage - 1) * this.limit;
        }
        this.getCountSubjects();
    }

}

