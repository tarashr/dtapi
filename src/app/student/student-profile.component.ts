import {Component, ViewChild, OnInit, ElementRef} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Params} from "@angular/router";
import {Group, Faculty, Student, EntityManagerBody} from "../shared/classes";
import {CRUDService} from "../shared/services/crud.service";
import {CommonService} from "../shared/services/common.service";
import {ModalImageCropperComponent} from "../shared/components/img-cropper/image-cropper.component";
import {Observable} from "rxjs/Rx";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ImageCropperComponent, CropperSettings} from "ng2-img-cropper";


import {patterns, delRecord} from "../shared/constant";

@Component({
    templateUrl: "student-profile.component.html",
    styleUrls: ["student.component.scss"],
})

export class StudentProfileComponent implements OnInit {

    public cropperData: any;
    public cropperSettings: CropperSettings;

    public user_id: number;
    public entity: string = "student";
    public student: Student;
    public entityUser: string = "AdminUser";
    public groupEntity: string = "Group";
    public groups: any[] = [];
    public facultyEntity: string = "Faculty";
    public faculties: any[] = [];
    private studentInfo: string;
    public delRecord = delRecord;
    private errorMessageCreateStudent: string = "Помилка при створенні профілю. Перевірте правильність введених даних";
    private errorMessageUpdateData: string = "Помилка обновлення. Перевірте правильність введених даних";
    private errorMessageGroupAbsence: string = "Для даного факультету не зареєстровано жодної групи!";
    public statusView: boolean = true;
    public action: boolean;
    public passwordStatusText: string = "password";
    public editSaveButtonName: string = "Редагувати дані";
    public surnamePattern: string = patterns.studentSurname;
    public namePattern: string = patterns.studentName;
    public fnamePattern: string = patterns.studentFname;
    public loginPattern: string = patterns.studentLogin;
    public gradebookPattern: string = patterns.studentGradebook;
    public emailPattern: string = patterns.studentEmail;

    @ViewChild("studentForm") studentForm: any;
    @ViewChild("studentPhoto") studentPhoto: ElementRef;
    @ViewChild("cropper", undefined) cropper: ImageCropperComponent;

    constructor(private route: ActivatedRoute,
                private crudService: CRUDService,
                private location: Location,
                private modalService: NgbModal,
                private commonService: CommonService) {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperData = {};
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.user_id = Number(params["id"]);
        });
        if (this.user_id) {
            this.action = false; // state: view/edit profile
            this.getData();
            this.getFacultyName();
        } else {
            this.statusView = false;
            this.action = true; // state: create new profile
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
        this.crudService.insertData(this.entity, dataForRequest)
            .subscribe(data => {
                    if (data.response === "ok") {
                        this.studentInfo = `${dataForRequest.student_surname} ${dataForRequest.student_name} ${dataForRequest.student_fname}`;
                        this.commonService.openModalInfo(`Створено профіль студента ${this.studentInfo}`);
                        this.newStudent();
                        this.studentForm.reset();
                    } else {
                        this.commonService.openModalInfo(`${this.errorMessageCreateStudent}`);
                    }
                },
                error => {
                    console.log("error: ", error);
                    this.commonService.openModalInfo(`${this.errorMessageCreateStudent}`);
                }
            );
    }

    getFacultyName() {
        this.crudService.getRecords(this.facultyEntity)
            .subscribe(facultyData => {
                    this.faculties = facultyData;
                },
                error => this.commonService.handleError(error)
            );
    }

    getGroupByFaculty(value: number) {
        this.groups = [];
        this.crudService.getGroupsByFaculty(value)
            .subscribe(groupData => {
                    if (groupData.response === "no records") {
                        this.groups.splice(0, this.groups.length, {group_name: this.errorMessageGroupAbsence, group_id: 0});
                    } else {
                        this.groups = groupData;
                    }
                },
                error => this.commonService.handleError(error)
            );
    }

    studGroupId(data: number) {
        this.student.group_id = data;
        if (data) {
            let studGroupId: Array <number> = [];
            studGroupId.push(this.student.group_id);
            let dataEnt = new EntityManagerBody(this.groupEntity, studGroupId);
            this.crudService.getEntityValues(dataEnt)
                .subscribe(data => {
                        this.student.group_name = data[0].group_name;
                    },
                    error => this.commonService.handleError(error)
                );
        }
    }

    getData() {
        this.student = new Student();
        Observable.forkJoin(
            this.crudService.getRecordById(this.entity, this.user_id),
            this.crudService.getRecordById(this.entityUser, this.user_id)
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
                this.crudService.getEntityValues(dataEnt)
                    .subscribe(data => {
                            this.student.group_name = data[0].group_name;
                            let studFacultyId: Array <number> = [];
                            studFacultyId.push(data[0].faculty_id);
                            let dataEnt = new EntityManagerBody(this.facultyEntity, studFacultyId);
                            this.crudService.getEntityValues(dataEnt)
                                .subscribe(data => {
                                        this.student.faculty_id = data[0].faculty_id;
                                        this.student.faculty_name = data[0].faculty_name;
                                        this.crudService.getGroupsByFaculty(this.student.faculty_id)
                                            .subscribe(groupData => {
                                                    this.groups = groupData;
                                                },
                                                error => this.commonService.handleError(error)
                                            );
                                    },
                                    error => this.commonService.handleError(error)
                                );
                        },
                        error => this.commonService.handleError(error)
                    );
            },
            error => this.commonService.handleError(error)
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
        this.crudService.updateData(this.entity, this.student.user_id, dataForUpdateStudent)
            .subscribe(data => {
                    if (data.response === "ok") {
                        this.studentInfo = `${dataForUpdateStudent.student_surname} ${dataForUpdateStudent.student_name} ${dataForUpdateStudent.student_fname}`;
                        this.commonService.openModalInfo(`Дані студента ${this.studentInfo} обновленно`);
                        this.editSaveButtonName = "Редагувати дані";
                        this.statusView = !this.statusView;
                    }
                    else {
                        this.commonService.openModalInfo(`${this.errorMessageUpdateData}`);

                    }
                },
                error => {
                    console.log("error: ", error);
                    this.commonService.openModalInfo(`${this.errorMessageUpdateData}`);
                    this.editSaveButtonName = "Зберегти дані";
                }
            );
    }

    showPassword() {
        this.passwordStatusText === "password" ? this.passwordStatusText = "text" : this.passwordStatusText = "password";
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
        this.studentInfo = `${this.student.student_surname} ${this.student.student_name} ${this.student.student_fname}`;
        let message: string[] = [`Ви дійсно хочете видалити профіль студента: ${this.studentInfo}?`, "confirm", "Попередження!"];
        this.commonService.openModalInfo(...message)
            .then(() => {
                this.delRecord(this.entity, this.student.user_id);
                this.location.back();
            }, () => {
                return;
            });
    }

    removePhoto() {
        let message: string[] = [`Ви дійсно хочете видалити дане фото?`, "confirm", "Попередження!"];
        this.commonService.openModalInfo(...message)
            .then(() => {
                this.studentPhoto.nativeElement.src = "assets/profile.png";
            }, () => {
                return;
            });
    }

    modalOpen() {
        this.modalService.open(ModalImageCropperComponent)
            .result
            .then((data: any) => {
                this.studentPhoto.nativeElement.src = data;
            }, () => {
                return;
            });
    }
}