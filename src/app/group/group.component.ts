import {Component, OnInit} from '@angular/core';

import {Group} from '../shared/classes/group';
import {GroupService} from '../shared/services/group.service';
@Component({
    selector:'group-container',
    templateUrl:'group.component.html',
    styleUrls:['group.component.css']
})
export class GroupComponent implements OnInit{
public groups:Group[];
public errorMessage:string;
    constructor(private groupService:GroupService){}
ngOnInit(){
    this.getGroup();
}
getGroup():void{
    this.groupService.getGroups()
        .subscribe(
            groups => {this.groups = groups},
            error => this.errorMessage = <any>error
        );
   }


}