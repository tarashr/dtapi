import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {CommonService} from "../shared/services/common.service";
import { LoginService } from "../shared/services/login.service";

@Component({
    selector: 'start-page',
    templateUrl: 'start-page.component.html',
	styleUrls: ['start-page.component.css'],
    providers: [LoginService]
})

export class StartPageComponent implements OnInit{
		
	public user={
		student_surname:"loading...",
		student_name:"loading...",
		group_id:""
	};
	
	public userGroup = {
		speciality_id:"",
		faculty_id:""
	};
	
	public userFaculty = {};
	public userSpeciality = {};
	
    constructor(
        private _loginService: LoginService,
        private _router: Router,
		private _commonService:CommonService
    ) { }

    private success(response:any){
        if (response.response==="non logged") {
            this._router.navigate(["/login"]);
        }
    }

    ngOnInit() {
		let userRole:string = sessionStorage.getItem("userRole");
		let userId:number = +sessionStorage.getItem("userId");
		if (!userRole && userRole != "student") {
            this._router.navigate(["/login"]);
        }
		
		this.getStudentProfile(userId);
		console.log(this.userGroup);
    }


	logout() {
		this._loginService.logout();
		localStorage.clear();
		sessionStorage.clear();
		this._router.navigate(["/login"]);
	}

	getStudentProfile(userId: number) {
		this._commonService.getRecordById("Student", userId)
			.subscribe(data=> {
				this.user = data[0];
				this._commonService.getRecordById("Group", this.user.group_id)
					.subscribe(data_grup=> {
						this.userGroup = data_grup[0];
						this._commonService.getRecordById("Faculty", this.userGroup.faculty_id)
							.subscribe(data_facult=>this.userFaculty = data_facult[0]);

						this._commonService.getRecordById("Speciality", this.userGroup.speciality_id)
							.subscribe(data_speciality=>this.userSpeciality = data_speciality[0]);

					})
			});
	}

}
