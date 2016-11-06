import {Component, OnInit} from "@angular/core";
// import {Router, ActivatedRoute, Params} from "@angular/router";
import {Location} from "@angular/common";
import {Group} from "../shared/classes/group";
import {Student} from "../shared/classes/student";
import {CRUDService} from "../shared/services/crud.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {type} from "os";

@Component({
    templateUrl: "student-new-profile.component.html",
    styleUrls: ["student.component.css"],
})
export class StudentNewProfileComponent implements OnInit {

    public student: Student [] = [];
    public newStudent: Student [] = [];
    public entity: string = "student";
    // public entityUser: string = "AdminUser";
    public groupEntity: string = "Group";
    public groups: Group[] = [];
    public user_id: number;
    public passwordStatus: boolean = false;
    public passwordStatusText: string = "text";
    public passwordButtonName: string = "Приховати пароль";
    // public editSaveStatus: boolean = true;
    public editSaveButtonName: string = "Зберегти дані";
    public statusView: boolean = true;
    public editSaveButtonStatus: boolean = false;


    // private route: ActivatedRoute,
    constructor(
                private _commonService: CRUDService,
                private location: Location,
                private modalService: NgbModal) {

    }

    ngOnInit() {
        this.dataForView();
        this.getGroupName();
        //this.createNewStudent();
    }

    goBack(): void {
        this.location.back();
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
            this.createNewStudent();
            this.editSaveButtonName = "Редагувати дані";
        }
        else {
            this.editSaveButtonName = "Зберегти дані";
        }
        this.statusView = !this.statusView;
    }

    dataForView(): void {
        this.student[0] = new Student();
        this.newStudent[0] = new Student();
    }

    getGroupName() {
        this._commonService.getRecords(this.groupEntity)
            .subscribe(data => {
                this.groups = data;
                },
                error => console.log("error: ", error)
                );
    }

    createNewStudent() {
        this._commonService.getRecords(this.groupEntity)
            .subscribe(data => {
                this.groups = data;
                for (let i in this.groups) {
                    if (this.groups[i].group_name === this.student[0].group_name) {
                        this.student[0].group_id = this.groups[i].group_id;
                    }
                }
                    // console.log(" getGroups this.student[0].group_id", this.student[0].group_id);

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
                    this.newStudent[0].photo = "";

                        console.log("this.newStudent[0]", JSON.stringify(this.newStudent));
                        console.log("this.student[0]", JSON.stringify(this.student[0]));

                        this._commonService.insertData(this.entity, this.newStudent[0])
                            .subscribe(data => {
                                    console.log("data : ", data);
                                },
                                error => console.log("error: ", error)
                            );
            },
                error => console.log("error: ", error)
            );
    }

    /*cleanData() {
        this.student[0] = new Student();
    }*/

    /* createNewStudent() {
        this.getGroups();
        console.log("this.newStudent[0]", JSON.stringify(this.newStudent));
        console.log("this.student[0]", JSON.stringify(this.student[0]));
        // console.log("createNewStudent student[0] : ",  this.newStudent[0]);


    }*/
}