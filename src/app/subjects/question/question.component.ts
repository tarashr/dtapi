import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {CRUDService}  from '../../shared/services/crud.service';
import {SubjectService}  from '../../shared/services/subject.service';
import {configAddQuestion, configEditQuestion, successEventModal} from '../../shared/constants';
import {Question} from "../../shared/classes/question";
import {headersQuestion, actionsQuestion} from "../../shared/constant-config"
import {ModalAddEditComponent} from "../../shared/components/addeditmodal/modal-add-edit.component";
import {InfoModalComponent} from "../../shared/components/info-modal/info-modal.component";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'question-container',
    templateUrl: 'question.component.html'
})

export class QuestionComponent implements OnInit {

    //common variables
    public entity: string = "task";
    public errorMessage: string;
    public entityTitle: string = "Завдання";

    public test_id: number;
    public headers: any = headersQuestion;
    public actions: any = actionsQuestion;
    public successEventModal = successEventModal;
    private config:any = {action: "create"};

    //variable for pagination
    public page: number = 1;
    public limit: number = 5;
    private entityDataLength: number;
    public offset: number = 0;
    public maxSize: number = 5;
    public paginationSize = this.maxSize;

    // variable for search
    public searchCriteria: string = "";
    public selectLimit: string = "Виберіть кількість завдань на сторінці";

    //varibles for addedit
    public configAdd = configAddQuestion;
    public configEdit = configEditQuestion;

    // variables for common component
    public entityData: any[] = [];

    public modalInfoConfig = {
        title: "",
        infoString: "",
        action: ""
    };

    constructor(private crudService: CRUDService,
                private route: ActivatedRoute,
                private router: Router,
                private subjectService: SubjectService,
                private location: Location,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.test_id = +params['id'];
            this.getCountRecordsByTest();
        });
    }

    goBack(): void {
        this.location.back();

    }

    getCountRecordsByTest() {
        this.subjectService.countRecordsByTest(this.test_id)
            .subscribe(
                res => {
                    this.entityDataLength = +res.numberOfRecords;
                    this.getRecordsRangeByTest();
                },
                error => this.errorMessage = <any>error
            )
    }

    getRecordsRangeByTest(): void {
        this.subjectService.getRecordsRangeByTest(this.test_id, this.limit, this.offset)
            .subscribe(
                data => {
                    let tempArr: any[] = [];
                    if(data.length) {
                        data.forEach(item => {
                            let question: any = {};
                            question.entity_id = item.question_id;
                            question.entityColumns = [
                                item.question_text,
                                item.level,
                                item.type,
                                item.attachment
                            ];
                            question.actions = this.actions;
                            tempArr.push(question);
                        });
                        this.entityData = tempArr;
                    }
                },
                error => this.errorMessage = <any>error
            );
    }

    changeLimit(limit: number): void {
        this.limit = limit;
        this.offset = 0;
        this.page = 1;
        this.getRecordsRangeByTest();
    }

    pageChange(num: number) {
        if (!num) {
            this.page = 1;
            return;
        }
        this.page = num;
        this.offset = (this.page - 1) * this.limit;
        this.getRecordsRangeByTest();
    }

    refreshData(action: string) {
        if (action === "delete" && this.entityData.length === 1 && this.entityDataLength > 1) {
            this.offset = (this.page - 2) * this.limit;
            this.page -= 1;
        } else if (this.entityData.length > 1) {
            this.offset = (this.page - 1) * this.limit;
        }
        this.getCountRecordsByTest();
    }

    activate(data: any) {
        console.log("!!! ", data);
        switch (data.action) {
            case "edit":
                // this.editCase(data);
                break;
            case "delete":
                // this.deleteCase(data);
                break;
            case "create":
                // this.createCase();
                break;
        }
    }

}



