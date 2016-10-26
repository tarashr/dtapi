import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {CRUDService} from "../../shared/services/crud.service";
import {Group} from "../../shared/classes/group";
import {Faculty} from "../../shared/classes/faculty";
import {Speciality} from "../../shared/classes/speciality";
import {EntityManagerBody} from "../../shared/classes/entity-manager-body";

@Component({
    templateUrl: 'groups-of-faculty.component.html',
    styleUrls: ['groups-of-faculty.component.css']
})
export class GroupsOfFacultyComponent implements OnInit {

    public groups:Group[]=[];
    public entity:string = "group";
    public facultyString:string = "facultyById";
    public faculty:Faculty = new Faculty("", "");
    public faculty_id:number;
    public speciality:Speciality[];

    private countOfFaculties:number;
    public limit:number = 5;
    private findResultFaculties;
    public searchData:string = "";
    public page:number = 1;
    private offset:number = 0;

    //data for child NgbdModalBasic
    public titleForNew = "Створити факультет";
    public nameForNew:string = "";
    public descriptionForNew:string = "";
    public create = "create";
    public titleForEdit = 'Редагувати дані факультету';
    public nameForEdit:string;
    public descriptionForEdit:string;
    public idEdit:number;
    public edit = "edit";
    //end

    constructor(private _router:Router,
                private route:ActivatedRoute,
                private _commonService:CRUDService) {
    }

    ngOnInit() {
        this.route.params.forEach((params:Params) => {
            this.faculty_id = +params['id']; // (+) converts string 'id' to a number
            this.getRecordsById(this.facultyString, this.faculty_id);
        });
        this.getGroupsByFaculty(this.faculty_id);
    }

    getGroupsByFaculty(id:number) {
        this._commonService.getGroupsByFaculty(id)
            .subscribe(
                data => this.groups = data,
                error=> {
                    if (error.response === "Only logged users can work with entities") {
                        this._router.navigate(["/login"])
                    }
                }
            )
    }

    getRecordsById(entity:string, id:number) {
        this._commonService.getRecordById(entity, id)
            .subscribe(data => {
                    this.faculty = data[0];
                    console.log('facultyById: ', this.faculty)
                },
                error=> {
                    if (error.response === "Only logged users can work with entities") {
                        this._router.navigate(["/login"])
                    }
                })
    }

    getEntityValues(data:EntityManagerBody, entityArray:any[]) {
        this._commonService.getEntityValues(data)
            .subscribe(data => entityArray = data,
                error=> {
                    if (error.response === "Only logged users can work with entities") {
                        this._router.navigate(["/login"])
                    }
                })

    }
}