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

	public headers = [
	// {name: "№", className: "col-xs-12 col-sm-1"},
	{name: "Предмет", className: "col-xs-12 col-sm-4"},
	{name: "Назва тесту", className: "col-xs-12 col-sm-4"},
	{name: "", className: "col-xs-12 col-sm-3"}
];

	public actions = [
	{
		title: "Запустити тест",
		action: "start",
		glyphicon: "glyphicon glyphicon-th",
		btnClassName: "btn btn-default btn-sm"
	}
];

	public entityData = [{
		entityColumns:["Асемблер", "Елементарний рівень"],
		entity_id: 1
	},
		{
			entityColumns:["Асемблер", "Елементарний рівень"],
			entity_id: 1
		},
		{
			entityColumns:["Асемблер", "Елементарний рівень"],
			entity_id: 1
		}];


   constructor(
        private _commonService:CRUDService
    ) { }
	
	ngOnInit() {
		this.getTestList();
		console.log ('student group:'+this.groupId);
    }

    activate(data){
		console.log(JSON.stringify(data));
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
