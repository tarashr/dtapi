import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import '../shared/rxjs-operators';
import {Router} from "@angular/router";
import {Subject}   from '../shared/classes/subject';
import {CRUDService}  from '../shared/services/crud.service';
import {configAddSubject, configEditSubject} from '../shared/constants';

@Component({
    selector: 'subject-container',
    templateUrl: 'subject.component.html'
})

export class SubjectComponent implements OnInit {

    //common variables
    public entity: string = "subject";
    public errorMessage: string;

    //variables for pagination
    public limit: number = 5;
    private entityDataLength: number;
    public page: number = 1;
    public offset: number = 0;
    public maxSize: number = 5;
    public paginationSize = this.maxSize;

    //variables for search
    public searchCriteria: string = "";

    //varibles for addedit
    public configAdd = configAddSubject;
    public configEdit = configEditSubject;

    // variables for common component
    public searchTitle: string = "Введіть дані для пошуку";
    public entityTitle: string = "Предмети";
    public selectLimit: string = "Виберіть кількість предметів на сторінці";

    public entityData: any[] = [];
    // public search: string = "";

    constructor(private crudService: CRUDService,
                private _router: Router) {
    }

    ngOnInit() {
        this.getCountSubjects();
    }

    headers = [
        {name: "№", style: "col-xs-12 col-sm-1"},
        {name: "Назва предмету", style: "col-xs-12 col-sm-4"},
        {name: "Опис предмету", style: "col-xs-12 col-sm-4"},
        {name: "", style: "col-xs-12 col-sm-3"}
    ];

    actions = [
        {title: "Перейти до тестів", action: "test", style: "glyphicon glyphicon-th"},
        {title: "Розклад тестів", action: "shedule", style: "glyphicon glyphicon-th"},
        {title: "Редагувати предмет", action: "edit", style: "glyphicon glyphicon-edit"},
        {title: "Видалити предмет", action: "delete", style: "glyphicon glyphicon-trash"}
    ];

    deleteSubject(entity: string, id: number): void {
        if (confirm('Підтвердіть видалення предмету')) {
            this.offset = (this.page - 1) * this.limit;
            this.crudService
                .delRecord(entity, id)
                .subscribe(
                    () => {
                        this.refreshData("delete");
                    },
                    error => this.errorMessage = <any>error
                );
        }
    }

    getCountSubjects() {
        this.crudService.getCountRecords(this.entity)
            .subscribe(
                res => {
                    this.entityDataLength = +res.numberOfRecords;
                    this.getSubjectsRange();
                },
                error => this.errorMessage = <any>error
            );
    }

    modalAdd(data: any) {
        if (data.action === "create") {
            let newSubject: Subject = new Subject(data.list[0].value, data.list[1].value);
            this.crudService.insertData(this.entity, newSubject)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        } else if (data.action === "edit") {
            let editedSubject: Subject = new Subject(data.list[0].value, data.list[1].value);
            this.crudService.updateData(this.entity, data.id, editedSubject)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData(data.action);
                });
        }
    }

    getSubjectsRange(): void {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    let tempArr: any[] = [];
                    data.forEach((item)=> {
                        let test: any = {};
                        test.entity_id = item.test_id;
                        test.entityColumns = [
                            item.test_name,
                            item.tasks,
                            item.time_for_test,
                            item.enabled,
                            item.attempts,
                            item.subject_id
                        ];
                        test.actions = this.actions;
                        tempArr.push(test);
                    });
                    this.entityData = tempArr;
                },
                error => this.errorMessage = <any>error
            );
    }

    changeLimit(limit: number): void {
        this.limit = limit;
        this.offset = 0;
        this.page = 1;
        this.getSubjectsRange();
    }

    pageChange(num: number) {
        if (!num) {
            this.page = 1;
            return;
        }
        this.page = num;
        this.offset = (this.page - 1) * this.limit;
        this.getSubjectsRange();
    }

    getSubjectsBySearch(): void {
        this.crudService.getRecordsBySearch(this.entity, this.searchCriteria)
            .subscribe(data => {
                    if (data.response == "no records") {
                        this.entityData = [];
                        return;
                    }
                    this.page = 1;
                    let tempArr: any[] = [];
                    data.forEach((item)=> {
                        let subject: any = {};
                        subject.entity_id = item.subject_id;
                        subject.entityColumns = [item.subject_name, item.subject_description];
                        subject.actions = this.actions;
                        tempArr.push(subject);
                    });
                    this.entityData = tempArr;
                },
                error=>console.log("error: ", error));
    };

    findEntity(searchTerm: string) {
        this.searchCriteria = searchTerm;
        if (this.searchCriteria.length === 0) {
            this.offset = 0;
            this.page = 1;
            this.getSubjectsRange();
            return;
        }
        this.getSubjectsBySearch();
    };

    refreshData(action: string) {
        if (action === "delete" && this.entityData.length === 1 && this.entityDataLength > 1) {
            this.offset = (this.page - 2) * this.limit;
            this.page -= 1;
        } else if (this.entityData.length > 1) {
            this.offset = (this.page - 1) * this.limit;
        }

        this.crudService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.entityDataLength = +data.numberOfRecords;
                    this.getSubjectsRange();
                },
                error=>console.log(error)
            );
    }

    activate(data: any) {
        console.log("!!! ", data);
        switch (data.action) {
            case "tests":
                this._router.navigate(["/admin/subject", data.entity_id, "tests"]);
                break;
            case "shedule":
                this._router.navigate(["/admin/subject", data.entity_id, "shedule"]);
                break;
            case "edit":
                console.log("we will edit ", data.entityColumns[0] + " with id: " + data.entity_id);
                break;
            case "delete":
                console.log("we will delete ", data.entityColumns[0] + " with id: " + data.entity_id);
                this.deleteSubject(this.entity, data.entity_id);
                break;
        }
    }


}

