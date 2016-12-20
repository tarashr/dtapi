import {Component, ViewChild, OnInit, ElementRef, Output, EventEmitter} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Params} from "@angular/router";
import {Group, Faculty, Student, EntityManagerBody} from "../shared/classes";
import {CRUDService} from "../shared/services/crud.service";
import {Observable} from "rxjs/Rx";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, Form} from "@angular/forms";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {ModalImageCropperComponent} from "../shared/components/img-cropper/image-cropper.component";

import {
    modalInfoConfig,
    successEventModal,
    patterns
} from "../shared/constant";

@Component({
    templateUrl: "student-profile.component.html",
    styleUrls: ["student.component.scss"],
})

export class StudentProfileComponent implements OnInit {

    name:string;
    data:any;  // cropper data
    cropperSettings: CropperSettings; // cropper data

    public user_id: number;
    public entity: string = "student";
    public student: Student;
    public entityUser: string = "AdminUser";
    public groupEntity: string = "Group";
    public groups: Array <any> = [];
    public facultyEntity: string = "Faculty";
    public facultys: Array <any> = [];

    public modalInfoConfig: any = modalInfoConfig;
    public successEventModal = successEventModal;

    public statusView: boolean = true;
    public action: Boolean;

    public passwordStatusText: string = "password";
    public editSaveButtonName: string = "Редагувати дані";

    public surnamePattern: string = patterns.studentSurname;
    public namePattern: string = patterns.studentName;
    public fnamePattern: string = patterns.studentFname;
    public loginPattern: string = patterns.studentLogin;
    public gradebookPattern: string = patterns.studentGradebook;
    public emailPattern: string = patterns.studentEmail;

    @Output() activate = new EventEmitter();

    @ViewChild("studentForm") studentForm: any;
    @ViewChild("studentPhoto") studentPhoto: ElementRef;

    @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
    @ViewChild('croppedPhotoOut') croppedPhotoOut: string;

    constructor(private route: ActivatedRoute,
                private _commonService: CRUDService,
                private location: Location,
                private modalService: NgbModal) {

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.data = {};
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.user_id = Number(params["id"]);
        });
        if (this.user_id) {
            this.action = false;
            this.getData();
            this.getFacultyName();
        }
        else  {
            this.statusView = false;
            this.action = true;
            this.newStudent();
        }
    }

    goBack(): void {
        this.location.back();
    }

    newStudent() {
        this.student = new Student;
        this.studentPhoto.nativeElement.src = "assets/profile.png";
        this.getFacultyName();
    }

    createNewStudent() {
        let dataForRequest = new Student;
        dataForRequest.username = this.student.username;
        dataForRequest.password = this.student.plain_password;
        dataForRequest.password_confirm = this.student.plain_password;
        dataForRequest.email = this.student.email;
        dataForRequest.gradebook_id = this.student.gradebook_id;
        dataForRequest.student_surname = this.student.student_surname;
        dataForRequest.student_name = this.student.student_name;
        dataForRequest.student_fname = this.student.student_fname;
        dataForRequest.group_id = this.student.group_id;
        dataForRequest.plain_password = this.student.plain_password;
        dataForRequest.photo = this.studentPhoto.nativeElement.src;
        this._commonService.insertData(this.entity, dataForRequest)
            .subscribe(data => {
                    if (data.response === "ok") {
                        this.modalInfoConfig.infoString = `Створено профіль студента ${dataForRequest.student_surname} ${dataForRequest.student_name} ${dataForRequest.student_fname}`;
                        this.successEventModal();
                        this.newStudent();
                        this.studentForm.reset();
                    } else {
                        this.modalInfoConfig.infoString = "Помилка при створенні профілю. Перевірте правильність введених даних";
                        this.successEventModal();
                    }
                },
                error => {
                    console.log("error: ", error);
                    this.modalInfoConfig.infoString = "Помилка при створенні профілю. Перевірте правильність введених даних";
                    this.successEventModal();
                }
            );
        }

    getFacultyName() {
        this._commonService.getRecords(this.facultyEntity)
            .subscribe(facultyData => {
                    this.facultys = facultyData;
                },
                error => console.log("error: ", error)
            );
    }

    getGroupByFaculty(value: number) {
        this.groups = [];
        this._commonService.getGroupsByFaculty(value)
            .subscribe(groupData => {
                    if (groupData.response === "no records") {
                        this.groups.splice(0, this.groups.length, {group_name: "Для даного факультету не зареєстровано жодної групи!", group_id: 0} );
                    } else {
                        this.groups = groupData;
                    }
                },
                error => console.log("error: ", error)
            );
    }

    studGroupId(data: number) {
        this.student.group_id = data;
        if (+data !== 0) {
        let studGroupId: Array <number> = [];
        studGroupId.push(this.student.group_id);
        let dataEnt = new EntityManagerBody(this.groupEntity, studGroupId);
        this._commonService.getEntityValues(dataEnt)
            .subscribe(data => {
                this.student.group_name = data[0].group_name;
            },
                error => console.log("error: ", error)
                );
        }
    }

    getData() {
        this.student = new Student();
        Observable.forkJoin(
            this._commonService.getRecordById(this.entity, this.user_id),
            this._commonService.getRecordById(this.entityUser, this.user_id)
        ).subscribe(data => {
                this.student.user_id = this.user_id;
                this.student.username = data[1][0].username;
                this.student.plain_password = data[0][0].plain_password;
                this.student.password = data[0][0].plain_password;
                this.student.password_confirm = data[0][0].plain_password;
                this.student.email = data[1][0].email;
                this.student.gradebook_id = data[0][0].gradebook_id;
                this.student.student_surname = data[0][0].student_surname;
                this.student.student_name = data[0][0].student_name;
                this.student.student_fname = data[0][0].student_fname;
                this.student.group_id = data[0][0].group_id;
                this.student.photo = data[0][0].photo;
                this.studentPhoto.nativeElement.src = this.student.photo;
                let studGroupId: Array <number> = [];
                studGroupId.push(this.student.group_id);
                let dataEnt = new EntityManagerBody(this.groupEntity, studGroupId);
                this._commonService.getEntityValues(dataEnt)
                    .subscribe(data => {
                            this.student.group_name = data[0].group_name;
                            let studFacultyId: Array <number> = [];
                            studFacultyId.push(data[0].faculty_id);
                            let dataEnt = new EntityManagerBody(this.facultyEntity, studFacultyId);
                            this._commonService.getEntityValues(dataEnt)
                                .subscribe(data => {
                                        this.student.faculty_id = data[0].faculty_id;
                                        this.student.faculty_name = data[0].faculty_name;
                                        this._commonService.getGroupsByFaculty(this.student.faculty_id)
                                            .subscribe(groupData => {
                                                    this.groups = groupData;
                                                },
                                                error => console.log("error: ", error)
                                            );
                                    },
                                    error => console.log("error: ", error)
                                );
                        },
                        error => console.log("error: ", error)
                    );
            },
            error => console.log("error: ", error)
        );
    }

    updateStudent() {
        let dataForUpdateStudent = new Student;
        dataForUpdateStudent.username = this.student.username;
        dataForUpdateStudent.password = this.student.plain_password;
        dataForUpdateStudent.password_confirm = this.student.plain_password;
        dataForUpdateStudent.email = this.student.email;
        dataForUpdateStudent.gradebook_id = this.student.gradebook_id;
        dataForUpdateStudent.student_surname = this.student.student_surname;
        dataForUpdateStudent.student_name = this.student.student_name;
        dataForUpdateStudent.student_fname = this.student.student_fname;
        dataForUpdateStudent.group_id = this.student.group_id;
        dataForUpdateStudent.plain_password = this.student.plain_password;
        dataForUpdateStudent.photo = this.studentPhoto.nativeElement.src;
        this._commonService.updateData(this.entity, this.student.user_id, dataForUpdateStudent)
            .subscribe(data => {
                    if (data.response === "ok") {
                        this.modalInfoConfig.infoString = `Дані студента ${dataForUpdateStudent.student_surname} ${dataForUpdateStudent.student_name} ${dataForUpdateStudent.student_fname} обновленно`;
                        this.successEventModal();
                        this.editSaveButtonName = "Редагувати дані";
                        this.statusView = !this.statusView;
                    }
                    else {
                        this.modalInfoConfig.infoString = `Помилка обновлення. Перевірте правильність введених даних`;
                        this.successEventModal();
                    }
                },
                error => {
                    console.log("error: ", error);
                    this.modalInfoConfig.infoString = "Помилка обновлення. Перевірте правильність введених даних";
                    this.successEventModal();
                    this.editSaveButtonName = "Зберегти дані";
                }
            );
    }

    showPassword() {
        if (this.passwordStatusText === "password") {
            this.passwordStatusText = "text";
        }
        else {
            this.passwordStatusText = "password";
        }
    }

    editSaveStudentProfile() {
        if (this.statusView) {
            this.editSaveButtonName = "Зберегти дані";
            this.statusView = !this.statusView;
        }
        else {
            this.updateStudent();
        }
    }

    deleteStudent() {
        let delRecord = (entity: string, id: number) => {
            this._commonService.delRecord(entity, id)
                .subscribe(() => {
                    this.modalInfoConfig.infoString = `Видалення пройшло успішно.`;
                    this.modalInfoConfig.action = "info";
                    const modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
                    modalRef.componentInstance.config = this.modalInfoConfig;
                    modalRef.result.then(() => {
                        return;
                    }, () => {
                        this.goBack();
                    });
                });
        };

        this.modalInfoConfig.infoString = `Ви дійсно хочете видати профіль студента: ${this.student.student_surname} ${this.student.student_name} ${this.student.student_fname}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                delRecord(this.entity, this.student.user_id);
            }, () => {
                return;
            });
    }

    removePhoto(){

        this.modalInfoConfig.infoString = `Ви дійсно хочете видати дане фото`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        modalRefDel.result
            .then(() => {
                this.studentPhoto.nativeElement.src = "assets/profile.png";
            }, () => {
                return;
            });
    }

    modalOpen(){
        let modalRef = this.modalService.open(ModalImageCropperComponent);
        modalRef.result
            .then((data: any) => {
                this.studentPhoto.nativeElement.src = data;
            }, () => {
                return;
            });
    }
}