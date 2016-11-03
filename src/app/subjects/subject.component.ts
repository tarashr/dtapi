import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import '../shared/rxjs-operators';
import {Router} from "@angular/router";
import {ModalAddEditComponent} from "../shared/components/addeditmodal/modal-add-edit.component";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject}   from '../shared/classes/subject';
import {CRUDService}  from '../shared/services/crud.service';
import {configAddSubject, configEditSubject, successEventModal} from '../shared/constants';
import {headersSubject, actionsSubject} from "../shared/constant-config"

@Component({
    selector: 'subject-container',
    templateUrl: 'subject.component.html'
})

export class SubjectComponent implements OnInit {

    //common variables
    public entity: string = "subject";
    public errorMessage: string;
    public headers: any = headersSubject;
    public actions: any = actionsSubject;

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
    public successEventModal = successEventModal;

    public entityData: any[] = [];

    constructor(private crudService: CRUDService,
                private _router: Router,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.getCountSubjects();
    }

    public modalInfoConfig = {
        title: "",
        infoString: "",
        action: ""
    };

    deleteSubject(entity: string, id: number): void {
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

    getSubjectsRange(): void {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
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
            case "test":
                this._router.navigate(["/admin/subject", data.entity_id, "test"]);
                break;
            case "shedule":
                this._router.navigate(["/admin/subject", data.entity_id, "shedule"]);
                break;
            case "edit":
                this.editCase(data);
                break;
            case "delete":
                this.deleteCase(data);
                break;
            case "create":
                this.createCase();
                break;
        }
    }

    createCase() {
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                let newSubject: Subject = new Subject(data.list[0].value, data.list[1].value);
                this.crudService.insertData(this.entity, newSubject)
                    .subscribe(response=> {
                        this.modalInfoConfig.infoString = `${data.list[0].value} успішно створено`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, ()=> {
                return
            });
    };

    editCase(data: any) {
        this.configEdit.list.forEach((item, i) => {
            item.value = data.entityColumns[i]
        });
        this.configEdit.id = data.entity_id;
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                let editedSubject: Subject = new Subject(data.list[0].value, data.list[1].value);
                this.crudService.updateData(this.entity, data.id, editedSubject)
                    .subscribe(()=> {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.refreshData(data.action);
                    });
            }, ()=> {
                return
            });
    }

    deleteCase(data: any) {
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати ${data.entityColumns[0]}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.deleteSubject(this.entity, data.entity_id);
            }, ()=> {
                return
            });
    }
}

