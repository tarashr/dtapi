import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

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
    private countOfGroup:number;
    public limit:number=5;
    public offset:number = 0;
    public page:number=1;
    constructor(private groupService:GroupService, private router:Router){}
ngOnInit(){
    this.countOfGroup = Number(localStorage.getItem('group'));
    this.getRecordsRange()
}

getCountRecords():void{
    this.groupService.getCountRecords()
        .subscribe(res=>this.countOfGroup=res.numberOfRecords,
                   error=>this.errorMessage=<any>error);
}

    changeLimit():void {
        this.offset = 0;
        this.page = 1;
        setTimeout(()=> {
            this.groupService.getRecordsRange(this.limit, this.offset)
                .subscribe(data => this.groups = data,
                    error=>this.errorMessage = <any>error);
        },0);
}
    getRecordsRange() {
        console.log('first time',this.offset);
        this.groupService.getRecordsRange( this.limit, this.offset)
            .subscribe(data => this.groups = data,
                       error=> {
                      if (error.response === "Only logged users can work with entities") {
                        this.router.navigate(["/login"])}
                       });

    }


      pageChange(num:number)
      {

          this.page = num;
          this.offset = (this.page - 1) * this.limit;
          this.getRecordsRange();
      }


}