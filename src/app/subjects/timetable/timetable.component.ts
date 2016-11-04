import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {CRUDService}  from '../../shared/services/crud.service';
import {SubjectService}  from '../../shared/services/subject.service';
import {configAddTimeTable, configEditTimeTable, successEventModal} from '../../shared/constants';
import {TimeTable} from "../../shared/classes/timetable";
import {headersTimeTable, actionsTimeTable} from "../../shared/constant-config"
import {ModalAddEditComponent} from "../../shared/components/addeditmodal/modal-add-edit.component";
import {InfoModalComponent} from "../../shared/components/info-modal/info-modal.component";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EntityManagerBody} from "../../shared/classes/entity-manager-body";

@Component({
    selector: 'timetable-container',
    templateUrl: 'timetable.component.html'
})

export class TimeTableComponent implements OnInit {

    //common variables
    public entity: string = "timeTable";
    public errorMessage: string;
    public pageTitle: string = "Розклад тестів по предмету";
    public subject_id: number;
    public page: number = 1;
    public limit: number = 0;
    public headers: any = headersTimeTable;
    public actions: any = actionsTimeTable;
    public successEventModal = successEventModal;
    private config: any = {action: "create"};

    //varibles for addedit
    public configAdd = configAddTimeTable;
    public configEdit = configEditTimeTable;

    // variables for common component
    public entityTitle: string = "Розклад тестів";
    public entityData: any[] = [];
    public groupsId = [];
    public groupsById = [];
    public timeTableWithGroupId = [];

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
            this.subject_id = +params['id']; // (+) converts string 'id' to a number
            this.getTimeTableForSubject();
        });
    }

    goBack(): void {
        this.location.back();

    }

    getTimeTableForSubject() {
        this.subjectService.getTimeTableForSubject(this.entity, this.subject_id)
            .subscribe(
                data => {
                    this.timeTableWithGroupId = data;
                    console.log("timeTableWithGroupId" + JSON.stringify(data));
                    for (let i = 0; i < data.length; i++) {
                        this.groupsId[i] = data[i].group_id;
                    }
                    this.getGroupsById();
                },
                error=>console.log("error: ", error),
                () => {
                    setTimeout(this.createTableConfig(this.timeTableWithGroupId), 0);
                    console.log("Group array" + JSON.stringify(this.timeTableWithGroupId));
                }
            )
    }

    getGroupsById() {
        let data = new EntityManagerBody("Group", this.groupsId);
        this.crudService.getEntityValues(data)
            .subscribe(
                data => {
                    this.groupsById = data;
                    console.log("groupsById" + JSON.stringify(data));
                    for (let i = 0; i < this.timeTableWithGroupId.length; i++) {
                        for (let j = 0; j < this.groupsById.length; j++) {
                            if (this.timeTableWithGroupId[i].group_id === this.groupsById[j].group_id) {
                                this.timeTableWithGroupId[j].group_name = this.groupsById[j].group_name;
                            }
                        }
                    }
                    console.log("groupsByIdresult" + JSON.stringify(this.timeTableWithGroupId));
                    error=>console.log("error: ", error)
                }
            )
    }

    private createTableConfig = (data: any)=> {
        let tempArr: any[] = [];
        if (this.timeTableWithGroupId.length) {
            this.timeTableWithGroupId.forEach((item)=> {
                let timetable: any = {};
                timetable.entity_id = item.test_id;
                timetable.entityColumns = [item.group_name, item.event_date];
                timetable.actions = this.actions;
                tempArr.push(timetable);
            });

            this.entityData = tempArr;
        }
    };

    deleteTimeTable(entity: string, id: number): void {
        this.crudService
            .delRecord(this.entity, id)
            .subscribe(
                () => {
                    this.getTimeTableForSubject();
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
        const modalRefAdd = this.modalService.open(ModalAddEditComponent);
        modalRefAdd.componentInstance.config = this.configAdd;
        modalRefAdd.result
            .then((data: any) => {
                let newTimeTable: TimeTable = new TimeTable(data.list[0].value,
                    data.list[1].value,
                    this.subject_id);
                this.crudService.insertData(this.entity, newTimeTable)
                    .subscribe(() => {
                        this.modalInfoConfig.infoString = `Новий розклад для групи ${data.list[0].value} успішно створено`;
                        this.successEventModal();
                        this.configAdd.list.forEach((item)=> {
                            item.value = ""
                        });
                        this.getTimeTableForSubject();
                    });
            }, ()=> {
                return
            });
    };

    editCase(data) {
        this.configEdit.list.forEach((item, i) => {
            item.value = data.entityColumns[i]
        });
        this.configEdit.id = data.entity_id;
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = this.configEdit;
        modalRefEdit.result
            .then((data: any) => {
                let editedTimeTable: TimeTable = new TimeTable(data.list[0].value,
                    data.list[1].value);
                this.crudService.updateData(this.entity, data.id, editedTimeTable)
                    .subscribe(()=> {
                        this.modalInfoConfig.infoString = `Редагування пройшло успішно`;
                        this.successEventModal();
                        this.getTimeTableForSubject();
                    });
            }, ()=> {
                return
            });
    }

    deleteCase(data) {
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати ${data.entityColumns[0]}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.deleteTimeTable(this.entity, data.entity_id);
            }, ()=> {
                return
            });
    }
}


