import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {CRUDService} from "../../shared/services/crud.service";
import {LoginService} from "../../shared/services/login.service";

@Component({
    selector: 'user-profile-component',
    templateUrl: 'user-profile.component.html',
    styleUrls: ['../start-page.component.scss']
})

export class UserProfileComponent implements OnInit {
    public user = {
        student_surname: "loading...",
        student_name: "loading...",
        group_id: ""
    };
    public userGroup = {
        speciality_id: "",
        faculty_id: ""
    };
    public userFaculty = {};
    public userSpeciality = {};
    public userId:number;

    constructor(private _loginService:LoginService,
                private _router:Router,
                private _commonService:CRUDService) {
    }

    private success(response:any) {
        if (response.response === "non logged") {
            this._router.navigate(["/login"]);
        }
    }

    ngOnInit() {
        this.userId = +sessionStorage.getItem("userId");
        this.getStudentProfile(this.userId);
    }

    logout() {
        this._loginService.logout();
    }

    getStudentProfile(userId:number) {
        this._commonService.getRecordById("Student", userId)
            .subscribe(data=> {
                this.user = data[0];
                this._commonService.getRecordById("Group", this.user.group_id)
                    .subscribe(dataGroup=> {
                        this.userGroup = dataGroup[0];
                        this._commonService.getRecordById("Faculty", this.userGroup.faculty_id)
                            .subscribe(dataFaculty=>this.userFaculty = dataFaculty[0]);
                        this._commonService.getRecordById("Speciality", this.userGroup.speciality_id)
                            .subscribe(dataSpeciality=>this.userSpeciality = dataSpeciality[0]);
                    })
            });
    }
}
