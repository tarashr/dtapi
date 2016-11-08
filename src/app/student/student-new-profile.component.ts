import {Component, ViewChild, OnInit, ElementRef} from "@angular/core";
import {Location} from "@angular/common";
import {Group} from "../shared/classes/group";
import {Faculty} from "../shared/classes/faculty";
import {Student} from "../shared/classes/student";
import {CRUDService} from "../shared/services/crud.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {NgForm} from "@angular/forms";
// import {Router, ActivatedRoute, Params} from "@angular/router";

import {
    modalInfoConfig,
    successEventModal
} from "../shared/constant";

@Component({
    templateUrl: "student-new-profile.component.html",
    styleUrls: ["student.component.css"],
    // directives: [ImageActionsComponent]
})
export class StudentNewProfileComponent implements OnInit {

    public student: Student [] = [];
    public newStudent: Student [] = [];
    public entity: string = "student";
    public facultyEntity: string = "Faculty";
    public facultys: Faculty [] = [];
    public idFaculty: number;
    // public curFaculty: number;
    public groupEntity: string = "Group";
    public groups: Group[] = [];
    // public groupName: string = "";
    public user_id: number;
    public passwordStatus: boolean = false;
    public passwordStatusText: string = "text";
    public passwordButtonName: string = "Приховати пароль";
    public editSaveButtonName: string = "Зберегти дані";
    public statusView: boolean = false;
    public editSaveButtonStatus: boolean = false;
    public modalInfoConfig: any = modalInfoConfig;
    public foto_src: string = "";

    @ViewChild("inputFoto") inputFoto;
    @ViewChild("inputFotoStud") inputFotoStud;

    constructor(private _commonService: CRUDService,
                private location: Location,
                private modalService: NgbModal,
                private element: ElementRef) {

    }

    public successEventModal = successEventModal;

    ngOnInit() {
        this.dataForView();
        // this.getGroupName();
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
            this.editSaveButtonName = "Зберегти дані";
        }
        else {
            this.createNewStudent();
            this.editSaveButtonName = "Редагувати дані";
        }
        this.statusView = !this.statusView;
    }

    dataForView(): void {
        this.student[0] = new Student();
        this.newStudent[0] = new Student();
        this.getFacultyName();
    }

    getFacultyName() {
        this._commonService.getRecords(this.facultyEntity)
            .subscribe(facultyData => {
                    this.facultys = facultyData;
                },
                error => console.log("error: ", error)
            );
    }

    getGroupName(id: number) {
        this.idFaculty = id;
        this.groups = [];
        this._commonService.getGroupsByFaculty(this.idFaculty)
            .subscribe(data => {
                    if (data.response === "no records") {
                        this.groups.push(new Group("Для даного факультету не зареэстровано жодноъ групи"));
                    } else {this.groups = data; }
                },
                error => console.log("error: ", error)
            );
    }

    createNewStudent() {
        this._commonService.getGroupsByFaculty(this.idFaculty)
            .subscribe(data => {
                    this.groups = data;
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
                    console.log("this.inputFoto : ", this.inputFotoStud.src);
                    this.newStudent[0].photo = this.inputFoto;
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

    activate(data: any) {
        switch (data.action) {
            case "delete":
                this.infoCase(data);
                break;
        }
    }


    infoCase(data: any) {
        this.modalInfoConfig.infoString = `Ви дійсно хочете видати ${data.entityColumns[1]}?`;
        this.modalInfoConfig.action = "confirm";
        this.modalInfoConfig.title = "Видалення";
        const modalRefDel = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRefDel.componentInstance.config = this.modalInfoConfig;
        /*modalRefDel.result
         .then(() => {
         this.delRecord(this.entity, data.entity_id);
         }, () => {
         return;
         })*/
    }

    /* fileChange(input) {
     let input = event.target;

     let reader = new FileReader();
     reader.onload = function(){
     var dataURL = reader.result;
     var output = document.getElementById("output");
     output.src = dataURL;
     };
     reader.readAsDataURL(input.files[0]);*/


    /*changeListner(event) {
     let reader = new FileReader();
     let image = this.element.nativeElement.querySelector("#output");

     reader.onload = function(e) {
     image.src = e.target.result;
     };

     reader.readAsDataURL(event.target.files[0]);
     }*/

    openFile(event) {
        let input = event.target;

        let reader = new FileReader();
        reader.onload = function () {
            // let dataURL = reader.result;
            // let output = document.getElementById("output");
            // output.src = dataURL;
            let dataURL = reader.result;
            // document.getElementById("output") = dataURL;
            console.log("dataURL : ", dataURL);
            // this.input.src = dataURL;
            // this.foto_src = dataURL;
            // this.inputFotoStud.src = dataURL;
            // console.log("this.input.src : ", this.input.src);
        };
        reader.readAsDataURL(input.files[0]);
        // console.log("reader.readAsDataURL(input.files[0]): ", reader.readAsDataURL(input.files[0]));
    }

}