import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Group} from '../shared/classes/group';
import {Faculty} from '../shared/classes/faculty';
import {Speciality} from '../shared/classes/speciality';
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
    public facultyId=[];
    public specialityId=[];
    public faculty:Faculty[];
    public speciality:Speciality[];
    public specialityName=[];
    constructor(private groupService:GroupService, private router:Router){}
ngOnInit(){
    this.countOfGroup = Number(localStorage.getItem('group'));
    this.getRecordsRange();

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
            this.getRecordsRange()

        },0);
}
    getRecordsRange() {

        this.groupService.getRecordsRange( this.limit, this.offset)
            .subscribe(data => {this.groups = data;
                    console.log(this.groups);
                for(let i=0;i<data.length;i++){
                                this.facultyId[i]=data[i].faculty_id;
                                 this.specialityId[i]=data[i].speciality_id;
                                 };this.getFaculty();
                                   this.getSpeciality();
                }        ,
                       error=> {
                      if (error.response === "Only logged users can work with entities") {
                        this.router.navigate(["/login"])}
                       });
            }

    getFaculty(){
        this.groupService.getFaculty(this.facultyId)
            .subscribe(data=>{this.faculty=data;
                              console.log(this.faculty);
                for(let i=0;i<this.groups.length;i++){
                    for(let j=0;j<this.faculty.length;j++) {
                        if (this.groups[i].faculty_id === this.faculty[j].faculty_id){
                            this.groups[i].faculty_name=this.faculty[j].faculty_name;
                        }
                            }
                }
                             },
            error=> {
            if (error.response === "Only logged users can work with entities") {
                this.router.navigate(["/login"])}
        });

    }
    getSpeciality(){
        this.groupService.getSpeciality(this.specialityId)
            .subscribe(data=>{this.speciality=data;
                    console.log(this.speciality);
                    for(let i=0;i<this.groups.length;i++){
                        for(let j=0;j<this.speciality.length;j++) {
                            if (this.groups[i].speciality_id === this.speciality[j].speciality_id){
                                this.groups[i].speciality_name=this.speciality[j].speciality_name;
                            }
                        }
                    }
                },
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