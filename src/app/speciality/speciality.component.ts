import {Component, OnInit} from '@angular/core';
import {Speciality} from '../shared/classes/speciality';
import {SpecialityService} from '../shared/services/speciality.service';
@Component({
    selector:'speciality-container',
    templateUrl:'speciality.component.html',
    styleUrls:['speciality.component.css']
})
export class SpecialityComponent implements OnInit{
public specialities:Speciality[];
public errorMessage:string;
    constructor(private specialityService:SpecialityService){}
ngOnInit(){
    this.getSpeciality();
}
getSpeciality():void{
    this.specialityService.getSpecialities()
        .subscribe(
            specialities => {this.specialities = specialities},
            error => this.errorMessage = <any>error
        );
   }


}