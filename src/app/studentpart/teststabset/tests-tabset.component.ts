import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'ngbd-tabset-tests',
    templateUrl: './tests-tabset.component.html'
})

export class TestsTabsetComponent implements OnInit{

	@Input() groupName;
	@Input() groupId;

   constructor(

    ) { }
	
	ngOnInit() {
        console.log("Group Id from tabs="+this.groupId);


    }



	
}


