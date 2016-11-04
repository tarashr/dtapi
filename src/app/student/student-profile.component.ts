import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Student} from "../shared/classes/student";
import {Group} from "../shared/classes/group";
import {CRUDService} from "../shared/services/crud.service";
import {EntityManagerBody} from "../shared/classes/entity-manager-body";
import {Observable} from "rxjs/Rx";

@Component({
    templateUrl: "student-profile.component.html",
    styleUrls: ["student.component.css"],
})
export class StudentProfileComponent implements OnInit {

    public student: Array <any> = [];
    public entity: string = "student";
    public entityUser: string = "AdminUser";
    public groupEntity: string = "Group";
    public groups: Group[] = [];
    public user_id: number;
    public passwordStatus: boolean = true;
    public passwordStatusText: string = "password";
    public passwordButtonName: string = "Показати пароль";
    public editSaveStatus: boolean = false;
    public editSaveButtonName: string = "Редагувати дані";
    public statusView: string = "disabled";
    private studentDataPart1: Array <any>;
    private studentDataPart2: Array <any>;

    constructor(private _router: Router,
                private route: ActivatedRoute,
                private _commonService: CRUDService,
                private location: Location) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.user_id = +params["id"]; // (+) converts string 'id' to a number
            this.getData();
        });
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
        if (this.editSaveStatus) {
            this.editSaveButtonName = "Редагувати дані";
            this.statusView = "disabled";
        }
        else {
            this.editSaveButtonName = "Зберегти дані";
            this.statusView = "";
        }
        this.editSaveStatus = !this.editSaveStatus;
    }

    getData() {
        Observable.forkJoin(
            this._commonService.getRecordById(this.entity, this.user_id),
            this._commonService.getRecordById(this.entityUser, this.user_id)
        ).subscribe(data => {
                this.studentDataPart1 = data[0];
                this.studentDataPart2 = data[1];
                Object.assign(this.student, this.studentDataPart1);
                this.student[0].email = this.studentDataPart2[0].email;
                this.student[0].username = this.studentDataPart2[0].username;
                this.getGroupName();
            },
            err => console.error(err)
        );
    }

    getGroupName() {
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
    }
}