import {Component, ViewChild, OnInit, ElementRef} from "@angular/core";
import {Location} from "@angular/common";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Group} from "../shared/classes/group";
import {Faculty} from "../shared/classes/faculty";
import {Student} from "../shared/classes/student";
import {CRUDService} from "../shared/services/crud.service";
import {EntityManagerBody} from "../shared/classes/entity-manager-body";
import {Observable} from "rxjs/Rx";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";

import {
    modalInfoConfig,
    // delRecord,
    successEventModal
} from "../shared/constant";

@Component({
    templateUrl: "student-profile.component.html",
    styleUrls: ["student.component.css"],
})

export class StudentProfileComponent implements OnInit {

    public student: Student [] = [];
    public newStudent: Student [] = [];
    public entity: string = "student";
    public facultys: Faculty [] = [];
    public idFaculty: number;
    public curFaculty: string;
    public facultyEntity: string = "Faculty";
    public entityUser: string = "AdminUser";
    public groupEntity: string = "Group";
    public groups: Group[] = [];
    public user_id: number;
    public passwordStatus: boolean = true;
    public passwordStatusText: string = "password";
    public passwordButtonName: string = "Показати пароль";
    public editSaveButtonName: string = "Редагувати дані";
    public statusView: boolean = true;
    private studentDataPart1: Array <any>;
    private studentDataPart2: Array <any>;
    public modalInfoConfig: any = modalInfoConfig;
    // public delRecord = delRecord;
    public successEventModal = successEventModal;



    @ViewChild("newFotoSrc") newFotoSrc: ElementRef;

    constructor(private route: ActivatedRoute,
                private _commonService: CRUDService,
                private location: Location,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.user_id = +params["id"]; // (+) converts string 'id' to a number
        });
        this.getData();
    }

    goBack(): void {
        this.location.back();
    }

    updateStudent() {
        this.newStudent[0] = new Student;
        this.newStudent[0].username = this.student[0].username;
        this.newStudent[0].password = this.student[0].plain_password;
        this.newStudent[0].password_confirm = this.student[0].plain_password;
        this.newStudent[0].email = this.student[0].email;
        this.newStudent[0].gradebook_id = this.student[0].gradebook_id;
        this.newStudent[0].student_surname = this.student[0].student_surname;
        this.newStudent[0].student_name = this.student[0].student_name;
        this.newStudent[0].student_fname = this.student[0].student_fname;
        this.newStudent[0].group_id = this.student[0].group_id;
        this.newStudent[0].plain_password = this.student[0].plain_password;
        this.newStudent[0].photo = this.newFotoSrc.nativeElement.src;
        this._commonService.updateData(this.entity, this.student[0].user_id, this.newStudent[0])
            .subscribe(data => {
                if (data.response === "ok") {
                    this.modalInfoConfig.infoString = `Дані студента ${this.newStudent[0].student_surname} ${this.newStudent[0].student_name} ${this.newStudent[0].student_fname} обновленно`;
                    this.successEventModal(); }
                    if (data.response === "error") {
                        this.modalInfoConfig.infoString = `Помилка обновлення. Перевірте дані`;
                        this.successEventModal(); }
                },
                error => console.log("error: ", error)
            );
    }

    getData() {
        Observable.forkJoin(
            this._commonService.getRecordById(this.entity, this.user_id),
            this._commonService.getRecordById(this.entityUser, this.user_id)
        ).subscribe(data => {
                this.studentDataPart1 = data[0];
                this.studentDataPart2 = data[1];
                this.student = this.studentDataPart1;
                this.student[0].email = this.studentDataPart2[0].email;
                this.student[0].username = this.studentDataPart2[0].username;
                let studGroupId: Array <number> = [];
                studGroupId.push(this.student[0].group_id);
                let dataEnt = new EntityManagerBody(this.groupEntity, studGroupId);
                this._commonService.getEntityValues(dataEnt)
                    .subscribe(data => {
                        this.groups = data;
                        this.student[0].group_name = this.groups[0].group_name;
                        let studFacultyId: Array <number> = [];
                        studFacultyId.push(this.groups[0].group_id);
                        let dataEnt = new EntityManagerBody(this.facultyEntity, studFacultyId);
                        this._commonService.getEntityValues(dataEnt)
                            .subscribe(data => {
                                    this.facultys = data;
                                    this.student[0].faculty_name = this.facultys[0].faculty_name;
                                    console.log(" this.student[0].faculty_name :", this.student[0].faculty_name);
                                },
                                error => console.log("error: ", error)
                            );
                        },
                        error => console.log("error: ", error)
                    );
        },
            /*this.getGroupFacultyNameById(this.student[0].group_id);*/

            error => console.log("error: ", error)
        );
    }

    /*getGroupFacultyNameById(id: number) {
        let studGroupId: Array <number> = [];
        studGroupId.push(id);
        let dataEnt = new EntityManagerBody(this.groupEntity, studGroupId);
        this._commonService.getEntityValues(dataEnt)
            .subscribe(data => {
                    this.groups = data;
                    this.student[0].group_name = this.groups[0].group_name;
                    let studFacultyId: Array <number> = [];
                    studFacultyId.push(this.groups[0].group_id);
                    let dataEnt = new EntityManagerBody(this.facultyEntity, studFacultyId);
                    this._commonService.getEntityValues(dataEnt)
                        .subscribe(data => {
                            this.facultys = data;
                                this.curFaculty = this.facultys[0].faculty_name;
                                console.log(" this.facultys :", this.facultys[0].faculty_name);
                                console.log(" this.curFaculty :", this.curFaculty);
                            },
                            error => console.log("error: ", error)
                        );

                },
                error => console.log("error: ", error)
            );

    }*/

    /*getGroupName() {
        let studGroupId: Array <number> = [];
        studGroupId.push(this.student[0].group_id);
        let dataEnt = new EntityManagerBody(this.groupEntity, studGroupId);
        this._commonService.getEntityValues(dataEnt)
            .subscribe(data => {
                    this.groups = data;
                    this.student[0].group_name = this.groups[0].group_name;
                },
                error => console.log("error: ", error)
            );
    }*/

    /*getFacultyName() {
        this._commonService.getRecords(this.facultyEntity)
            .subscribe(facultyData => {
                    this.facultys = facultyData;
                },
                error => console.log("error: ", error)
            );
    }*/

   /*changeFile(event) {
        let input = event.target;
        let reader = new FileReader();
        reader.onload = function () {
            let mysrc = <HTMLInputElement>document.getElementById("output");
            mysrc.src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }*/

    changeFile(event) {
        let input = event.target;
        if (input.files[0].size > 5000000) {
            this.modalInfoConfig.infoString = `Розмір фотографії повинен бути не більше 5Мб`;
            console.log(" this.modalInfoConfig.infoString : ",  this.modalInfoConfig.infoString);
            this.successEventModal();
            return; }
        let reader = new FileReader();
        reader.onload = function () {
            let mysrc = <HTMLInputElement>document.getElementById("output");
            mysrc.src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }

    showPassword() {
        if (this.passwordStatus) {
            this.passwordButtonName = "Приховати пароль";
            this.passwordStatusText = "text";
        }
        else {
            this.passwordButtonName = "Показати пароль";
            this.passwordStatusText = "password";
        }
        this.passwordStatus = !this.passwordStatus;
    }

    editSaveStudentProfile() {
        if (this.statusView) {
            this.editSaveButtonName = "Зберегти дані";
        }
        else {
            this.updateStudent();
            this.editSaveButtonName = "Редагувати дані";
        }
        this.statusView = !this.statusView;
    }




    deleteStudent() {
    let delRecord = function (entity: string, id: number) {
            // this.offset = (this.page - 1) * this.limit;
            this.crudService.delRecord(entity, id)
                .subscribe(() => {
                    this.modalInfoConfig.infoString = `Видалення пройшло успішно.`;
                    this.modalInfoConfig.action = "info";
                    const modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
                    modalRef.componentInstance.config = this.modalInfoConfig;
                    // this.refreshData("delete");
                });
        };


        let data = this.student[0];
        console.log("data : ", data);
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати ${data.student_surname} ${data.student_name} ${data.student_fname}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                delRecord(this.entity, data.user_id);
            }, () => {
                return;
            });
        // this.goBack();
    }

}