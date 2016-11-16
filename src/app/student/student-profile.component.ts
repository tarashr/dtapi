import {Component, ViewChild, OnInit, ElementRef} from "@angular/core";
import {Location} from "@angular/common";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Group} from "../shared/classes/group";
import {Faculty} from "../shared/classes/faculty";
import {Student} from "../shared/classes/student";
import {CRUDService} from "../shared/services/crud.service";
import {EntityManagerBody} from "../shared/classes/entity-manager-body";
import {Observable, Subscription} from "rxjs/Rx";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";

import {
    modalInfoConfig,
    successEventModal
} from "../shared/constant";

@Component({
    templateUrl: "student-profile.component.html",
    styleUrls: ["student.component.css"],
})

export class StudentProfileComponent implements OnInit {

    public user_id: number;
    public entity: string = "student";
    public student: Student;
    public entityUser: string = "AdminUser";
    public groupEntity: string = "Group";
    public group: Group;
    public facultyEntity: string = "Faculty";

    public modalInfoConfig: any = modalInfoConfig;
    public successEventModal = successEventModal;
    private maxFileSize: number = 5000000;

    public statusView: boolean = true;

    public passwordStatus: boolean = true;
    public passwordStatusText: string = "password";
    public editSaveButtonName: string = "Редагувати дані";

    private subscription: Subscription;




    constructor(private route: ActivatedRoute,
                private _commonService: CRUDService,
                private location: Location,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.user_id = Number(params["id"]);
        });
        if (this.user_id) {
            this.student = new Student();
            this.getData();
        }
        else  {

        }
    }

    goBack(): void {
        this.location.back();
    }

    getData() {
        // this.student = new Student();
        Observable.forkJoin(
            this._commonService.getRecordById(this.entity, this.user_id),
            this._commonService.getRecordById(this.entityUser, this.user_id)
        ).subscribe(data => {
            // let studentData1: Array <any>;
            // let studentData2: Array <any>;
            console.log("data1", data[1][0].username);
            // studentData1 = data[0];
            // studentData2 = data[1];
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

            let studGroupId: Array <number> = [];
            studGroupId.push(this.student.group_id);
            let dataEnt = new EntityManagerBody(this.groupEntity, studGroupId);
            this._commonService.getEntityValues(dataEnt)
                .subscribe(data => {
                    this.student = data.group_name;
                    let studFacultyId: Array <number> = [];
                    studFacultyId.push(data.faculty_id);
                    let dataEnt = new EntityManagerBody(this.facultyEntity, studFacultyId);
                    this._commonService.getEntityValues(dataEnt)
                    .subscribe(data => {
                        this.student.faculty_id = data.faculty_id;
                        this.student.faculty_name = data.faculty_name;
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

    }

    changeFile(event) {
        let input = event.target;
        if (input.files[0].size > this.maxFileSize) {
            this.modalInfoConfig.infoString = `Розмір фотографії повинен бути не більше 5Мб`;
            this.successEventModal();
            return;
        }
        let reader = new FileReader();
        reader.onload = function () {
            let mysrc = <HTMLInputElement>document.getElementById("output");
            mysrc.src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }

    showPassword() {
        if (this.passwordStatus) {
            this.passwordStatusText = "text";
        }
        else {
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

}