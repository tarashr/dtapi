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
	
	public entity:string = "student";
	public user={
		student_surname:"3",
		student_name:"3"
	};
	
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
		this.getRecordsById(this.entity, userId);
    }
	
	getRecordsById(entity:string, id:number){
	console.log(this.user);
        this._commonService.getRecordById(entity, id)
			.subscribe(data=>{this.user=data[0]; console.log(this.user)});
	}

    logout() {
		
        this._loginService.logout();
		localStorage.clear();
        sessionStorage.clear();
        this._router.navigate(["/login"]);
    }
	

}
