import {Component, OnInit, Input} from '@angular/core';
import { CRUDService } from "../../shared/services/crud.service";

@Component({
    selector: 'test-list',
    templateUrl: './test-list.component.html'
})

export class TestListComponent implements OnInit{
	@Input() groupId;
	
	public tests = [{
		subject_id :"...",
		subjectName:"..."
	}];
	
	
   constructor(
        private _commonService:CRUDService
    ) { }
	
	ngOnInit() {
		
		this.getTestList();
		console.log ('student group:'+this.groupId);
    }
	
	getTestList(){
		this._commonService.getRecords("Test")
			.subscribe(data=> {
				this.tests = data;
				
				for (let i = 0; i < this.tests.length; i++){
					this._commonService.getRecordById("Subject", this.tests[i].subject_id)
				.subscribe(subject=> {
					this.tests[i].subjectName = subject[0].subject_name;
					}
					)
				}
				}	
			)
	}
	
}
