import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Group} from '../shared/classes/group';
import {Faculty} from '../shared/classes/faculty';
import {Speciality} from '../shared/classes/speciality';
import {Student} from "../shared/classes/student";
import {CRUDService}  from '../shared/services/crud.service';
import {EntityManagerBody} from "../shared/classes/entity-manager-body";

@Component({
    selector: 'group-container',
    templateUrl: 'group.component.html',
    styleUrls: ['group.component.css']
})

export class GroupComponent implements OnInit {

    //common variables
    public entity:string = "group";
    public entityFaculty:string = "faculty";
    public entitySpeciality:string = "speciality";
    public entityStudent:string = "student";
    public groups: Group[];
    public errorMessage: string;

    //variables for displey
    public facultiesId: number[] = [];
    public specialitiesId: number[] = [];
    public facultyById: Faculty[];
    public specialityById: Speciality[];

    //variables for pagination
    public countOfGroup: number;
    public limit: number = 5;
    public offset: number = 0;
    public page: number = 1;

    //variables for search
    public searchCriteria: string;

    //variables for addedit action
    public create = "create";
    public edit = "edit";
    public titleForEdit = "Редагувати дані групи";
    public titleForNew = "Створити нову групу";
    public facultyId: number;
    public specialityId: number;
    public specialityName: string;
    public facultyName: string;
    public faculties: Faculty[];
    public specialities: Speciality[];

    //variables for delete group
    public students: Student[];

    constructor(
        private router: Router,
        private crudService:CRUDService
    ) {}

    ngOnInit() {
        this.getCountGroups();
        this.getFaculties();
        this.getSpecialities();
        this.getStudents();
    }

    getCountGroups(): void {
        this.crudService.getCountRecords(this.entity)
            .subscribe(res=> {
                    this.countOfGroup = +res.numberOfRecords;
                    this.getGroupsRange();
                },
                error=>this.errorMessage = <any>error
            );
    }

    changeLimit($event): void {
        console.log($event.currentTarget.value);
        this.limit = $event.currentTarget.value;
        this.offset = 0;
        this.page = 1;
        this.getGroupsRange();
    }

    getGroupsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(data => {
                    this.groups = data;
                    console.log(this.groups);
                    for (let i = 0; i < data.length; i++) {
                        this.facultiesId[i] = data[i].faculty_id;
                        this.specialitiesId[i] = data[i].speciality_id;
                    }
                    this.getFacultyById();
                    this.getSpecialityById();
                },
                error=> {
                    if (error.response === "Only logged users can work with entities") {
                        this.router.navigate(["/login"])
                    }
                });
    }

    getFacultyById() {
        // let data = {
        //     entity: this.entityFaculty,
        //     ids: this.facultiesId
        // };
        let data = new EntityManagerBody(this.entityFaculty, this.facultiesId);
        this.crudService.getEntityValues(data)
            .subscribe(data=> {
                    this.facultyById = data;
                    console.log(this.facultyById);
                    for (let i = 0; i < this.groups.length; i++) {
                        for (let j = 0; j < this.facultyById.length; j++) {
                            if (this.groups[i].faculty_id === this.facultyById[j].faculty_id) {
                                this.groups[i].faculty_name = this.facultyById[j].faculty_name;
                            }
                        }
                    }
                },
                error=> {
                    if (error.response === "Only logged users can work with entities") {
                        this.router.navigate(["/login"])
                    }
                });

    }

    getSpecialityById() {
        let data = new EntityManagerBody(this.entitySpeciality, this.specialitiesId);
        this.crudService.getEntityValues(data)
            .subscribe(data=> {
                    this.specialityById = data;
                    console.log(this.specialityById);
                    for (let i = 0; i < this.groups.length; i++) {
                        for (let j = 0; j < this.specialityById.length; j++) {
                            if (this.groups[i].speciality_id === this.specialityById[j].speciality_id) {
                                this.groups[i].speciality_name = this.specialityById[j].speciality_name;
                            }
                        }
                    }
                },
                error=> {
                    if (error.response === "Only logged users can work with entities") {
                        this.router.navigate(["/login"])
                    }
                });
    }

    pageChange(num: number) {
        if (!num) {
            this.page = 1;
            return;
        }
        this.page = num;
        this.offset = (this.page - 1) * this.limit;
        this.getGroupsRange();
    }

    refreshData(data: string) {
        if (this.groups.length === 1) {
            this.offset = (this.page - 2) * this.limit;
            this.page -= 1;
        } else if (this.groups.length > 1) {
            this.offset = (this.page - 1) * this.limit;
        }
        this.getCountGroups();
    }

    getFaculties(): void {
        this.crudService.getRecords(this.entityFaculty)
            .subscribe(
                faculties => this.faculties = faculties,
                error => this.errorMessage = <any>error
            );
    }

    getSpecialities(): void {
        this.crudService.getRecords(this.entitySpeciality)
            .subscribe(
                specialities => this.specialities = specialities,
                error => this.errorMessage = <any>error
            );
    }

    getNameOfFaculty($event) {
        this.facultyName = $event.currentTarget.value;
        this.faculties.forEach((item)=> {
            if (item.faculty_name == this.facultyName) {
                this.facultyId = item.faculty_id;
            }
        })
    }

    getNameOfSpeciality($event) {
        this.specialityName = $event.currentTarget.value;
        this.specialities.forEach((item)=> {
            if (item.speciality_name == this.specialityName) {
                this.specialityId = item.speciality_id;
            }
        })
    }

    getGroupsBySearch(): void {
        this.crudService.getRecordsBySearch(this.entity, this.searchCriteria)
            .subscribe(
                res => {
                    if (res.response === "no records") this.groups = [];
                    if (res.length) this.groups = res;
                },
                error => this.errorMessage = <any>error
            )
    }

    searchForData($event) {
        this.searchCriteria = $event.currentTarget.value;
        if (this.searchCriteria) {
            this.getGroupsBySearch();
        }
        else if (!this.searchCriteria) {
            this.getCountGroups();
        }
    }

    deleteGroup(group:Group): void {
        // group = this.groups;
        if (this.students.forEach((student)=> {
                    if (student.group_id == group.group_id) {
                        return true;
                    }
                }
            )) {
            alert("Не можливо видалити групу в якій навчаються студенти");
        } else {
            if (confirm('Підтвердіть видалення групи')) {
                this.crudService
                    .delRecord(this.entity, group.group_id)
                    .subscribe(
                        data => {
                            this.refreshData(data);
                            return true;
                        },
                        error => this.errorMessage = <any>error
                    );
            }
        }
    }

    getStudents(): void {
        this.crudService.getRecords(this.entityStudent)
            .subscribe(
                data => this.students = data,
                error => this.errorMessage = <any>error
            );
    }

}