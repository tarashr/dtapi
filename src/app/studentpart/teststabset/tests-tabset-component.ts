import {Component, OnInit} from '@angular/core';
import { CRUDService } from "../../shared/services/crud.service";

@Component({
    selector: 'ngbd-tabset-tests',
    templateUrl: './tests-tabset-component.html'
})

export class TestsTabsetComponent implements OnInit{
	public user={
		student_surname:"loading...",
		student_name:"loading...",
		group_id:""
	};
	
	public userGroup = {
		speciality_id:"",
		faculty_id:""
	};

   constructor(
        private _commonService:CRUDService
    ) { }
	
	ngOnInit() {
		
		let userId:number = +sessionStorage.getItem("userId");
		this.getStudentGroup(userId);
    }
	
	getStudentGroup(userId: number){
		this._commonService.getRecordById("Student", userId)
			.subscribe(data=> {
				this.user = data[0];
				this._commonService.getRecordById("Group", this.user.group_id)
					.subscribe(dataGroup => {this.userGroup = dataGroup[0];})
			}	
			)
	}
	
}


