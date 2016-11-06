import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {CRUDService}  from '../../shared/services/crud.service';
import {SubjectService}  from '../../shared/services/subject.service';
import {
    configAddTestDetail,
    configEditTestDetail,
    successEventModal,
    headersTestDetail,
    actionsTestDetail,
    modalInfoConfig} from '../../shared/constant';
import {TestDetail} from "../../shared/classes/test-detail";
import {ModalAddEditComponent} from "../../shared/components/addeditmodal/modal-add-edit.component";
import {InfoModalComponent} from "../../shared/components/info-modal/info-modal.component";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'test-detail-container',
    templateUrl: 'test-detail.component.html'
})

export class TestDetailComponent implements OnInit {

    //common variables
    public entity: string = "testDetail";
    public errorMessage: string;
    public pageTitle: string = "Детальніше про тест";
    public test_id: number;
    public page: number = 1;
    public limit: number = 0;
    public headers: any = headersTestDetail;
    public actions: any = actionsTestDetail;
    public successEventModal = successEventModal;
    private config: any = {action: "create"};
    public modalInfoConfig: any = modalInfoConfig;

    //varibles for addedit
    public configAdd = configAddTestDetail;
    public configEdit = configEditTestDetail;

    // variables for common component
    public entityTitle: string = "Детальніше про тест";
    public entityData: any[] = [];

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
            this.getTestDetailsByTest();
        });
    }

    goBack(): void {
        this.location.back();

    }

    getTestDetailsByTest() {
        this.subjectService.getTestDetailsByTest(this.test_id)
            .subscribe(
                data => {
                    let tempArr: any[] = [];
                    let numberOfOrder: number;
                    if (data.length) {
                        data.forEach((item, i)=> {
                            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
                            let testDetail: any = {};
                            testDetail.entity_id = item.id;
                            testDetail.entityColumns = [
                                numberOfOrder,
                                item.level,
                                item.tasks,
                                item.rate
                            ];
                            testDetail.actions = this.actions;
                            tempArr.push(testDetail);
                        });
                        this.entityData = tempArr;
                    }
                },
                error=>console.log("error: ", error)
            );
    }

    deleteTestDetail(entity: string, id: number): void {
        this.crudService
            .delRecord(this.entity, id)
            .subscribe(
                () => {
                    this.getTestDetailsByTest();
                },
                error => this.errorMessage = <any>error
            );
    }

    activate(data: any) {
        console.log("!!! ", data);
        switch (data.action) {
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
        this.configAdd.list.forEach((item)=> {
            item.value = ""
        });
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                let newTestDetail: TestDetail = new TestDetail(
                    data.list[0].value,
                    data.list[1].value,
                    data.list[2].value,
                    this.test_id);
                this.crudService.insertData(this.entity, newTestDetail)
                    .subscribe(() => {
                        this.modalInfoConfig.infoString = `${data.list[0].value} успішно створено`;
                        this.successEventModal();
                        this.getTestDetailsByTest();
                    });
            }, ()=> {
                return
            });
    };

    editCase(data) {
        this.configEdit.list.forEach((item, i) => {
            item.value = data.entityColumns[i+1]
        });
        this.configEdit.id = data.entity_id;
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                let editedTestDetail: TestDetail = new TestDetail(data.list[0].value,
                    data.list[1].value,
                    data.list[2].value)
                this.crudService.updateData(this.entity, data.id, editedTestDetail)
                    .subscribe(()=> {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.getTestDetailsByTest();
                    });
            }, ()=> {
                return
            });
    }

    deleteCase(data) {
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати ${data.entityColumns[1]}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.deleteTestDetail(this.entity, data.entity_id);
                console.log("dataaaa" + JSON.stringify(data));
            }, ()=> {
                return
            });
    }
}



