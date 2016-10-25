import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Group} from '../shared/classes/group';
import {Faculty} from '../shared/classes/faculty';
import {Speciality} from '../shared/classes/speciality';
import {GroupService} from '../shared/services/group.service';
import {Student} from "../shared/classes/student";

@Component({
    selector: 'group-container',
    templateUrl: 'group.component.html',
    styleUrls: ['group.component.css']
})

export class GroupComponent implements OnInit {

    public group: Group[];
    public groups: Group[];
    public errorMessage: string;
    public countOfGroup: number;
    public limit: number = 5;
    public offset: number = 0;
    public page: number = 1;
    public facultyId = [];
    public specialityId = [];
    public faculty: Faculty[];
    public facultys: Faculty[];
    public speciality: Speciality[];
    public specialitys: Speciality[];
    public specialityName = [];
    public searchCriteria: string;
    public create = "create";
    public edit = "edit";
    public titleForEdit = "Редагувати дані групи";
    public titleForNew = "Створити нову групу";
    public facultysId: number;
    public specialitysId: number;
    public students: Student[];
    public specialitysName:string;
    public facultysName:string;

    constructor(private groupService: GroupService,
                private router: Router) {
    }

    ngOnInit() {
        let userRole: string = sessionStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this.router.navigate(["/login"]);
        }
        // this.countOfGroup = Number(localStorage.getItem('group'));
        this.getCountRecords();
        this.getFacultys();
        this.getSpecialitys();
        this.getStudents();
        this.getGroup();
    }

    getCountRecords(): void {
        this.groupService.getCountRecords()
            .subscribe(res=> {
                    this.countOfGroup = +res.numberOfRecords;
                    this.getRecordsRange();
                },
                error=>this.errorMessage = <any>error
            );
    }

    changeLimit($event): void {
        console.log($event.currentTarget.value);
        this.limit = $event.currentTarget.value;
        this.offset = 0;
        this.page = 1;
        this.getRecordsRange();
    }

    getRecordsRange() {
        this.groupService.getRecordsRange(this.limit, this.offset)
            .subscribe(data => {
                    this.groups = data;
                    console.log(this.groups);
                    for (let i = 0; i < data.length; i++) {
                        this.facultyId[i] = data[i].faculty_id;
                        this.specialityId[i] = data[i].speciality_id;
                    }
                    this.getFaculty();
                    this.getSpeciality();
                },
                error=> {
                    if (error.response === "Only logged users can work with entities") {
                        this.router.navigate(["/login"])
                    }
                });
    }

    getFaculty() {
        this.groupService.getFaculty(this.facultyId)
            .subscribe(data=> {
                    this.faculty = data;
                    console.log(this.faculty);
                    for (let i = 0; i < this.groups.length; i++) {
                        for (let j = 0; j < this.faculty.length; j++) {
                            if (this.groups[i].faculty_id === this.faculty[j].faculty_id) {
                                this.groups[i].faculty_name = this.faculty[j].faculty_name;
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

    getSpeciality() {
        this.groupService.getSpeciality(this.specialityId)
            .subscribe(data=> {
                    this.speciality = data;
                    console.log(this.speciality);
                    for (let i = 0; i < this.groups.length; i++) {
                        for (let j = 0; j < this.speciality.length; j++) {
                            if (this.groups[i].speciality_id === this.speciality[j].speciality_id) {
                                this.groups[i].speciality_name = this.speciality[j].speciality_name;
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
            num = 1
        }
        this.page = num;
        this.offset = (this.page - 1) * this.limit;
        this.getRecordsRange();
    }

    refreshData(data: string) {
        if (this.groups.length === 1) {
            this.offset = (this.page - 2) * this.limit;
            this.page -= 1;
        } else if (this.groups.length > 1) {
            this.offset = (this.page - 1) * this.limit;
        }
        this.getCountRecords();
    }

    getFacultys(): void {
        this.groupService.getFacultys()
            .subscribe(
                facultys => this.facultys = facultys,
                error => this.errorMessage = <any>error
            );
    }

    getSpecialitys(): void {
        this.groupService.getSpecialitys()
            .subscribe(
                specialitys => this.specialitys = specialitys,
                error => this.errorMessage = <any>error
            );
    }

    getNameOfFaculty($event) {
        this.facultysName = $event.currentTarget.value;
        this.facultys.forEach((item)=> {
            if (item.faculty_name == this.facultysName) {
                this.facultysId = item.faculty_id;
            }
        })
    }

    getNameOfSpeciality($event) {
        this.specialitysName = $event.currentTarget.value;
        this.specialitys.forEach((item)=> {
            if (item.speciality_name == this.specialitysName) {
                this.specialitysId = item.speciality_id;
            }
        })
    }

    getGroupsBySearch(): void {
        this.groupService.getGroupsBySearch(this.searchCriteria)
            .subscribe(
                res => {
                    if (res.response === "no records") this.groups = [];
                    if (res.length) this.groups = res;
                    console.log(this.groups);
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
            this.getCountRecords();
        }
    }

    deleteGroup(group: Group): void {
        if (this.students.forEach((student)=> {
                if(student.group_id == group.group_id) {
                    return true;
                }

                }
            )) {
            alert("Не можливо видалити групу в якій навчаються студенти")
        } else {
            if (confirm('Підтвердіть видалення групи')) {
                this.groupService
                    .deleteGroup(group.group_id)
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
        this.groupService.getStudents()
            .subscribe(
                data => this.students = data,
                error => this.errorMessage = <any>error
            );
    }

    getGroup(): void {
        this.groupService.getAllGroup()
            .subscribe(
                data => this.group = data,
                error => this.errorMessage = <any>error
            );
    }

}