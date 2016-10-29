import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {Group}   from '../shared/classes/group';
import { CRUDService } from '../shared/services/crud.service';

@Component({
    selector: 'addedit-group',
    templateUrl: 'addedit-group.component.html',
    styleUrls: ['addedit-group.component.css']
})

export class AddeditGroupComponent {

    public errorMessage: string;
    public entity:string = "group";
    public facultyName:string;
    public specialityName:string;
    public facultyId;
    public specialityId;

    @Input() title:string;
    @Input() action: string;
    @Input() groups: Group;
    @Input() groupName:string;
    @Input() groupId:number;
    @Input() faculties;
    @Input() specialities;
    @Output() refreshData = new EventEmitter();

    constructor(private modalService: NgbModal,
                private crudService: CRUDService
    ) {}

    open(content) {
        this.modalService.open(content);
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    activate(): void {
        if (this.action === "create") {
            let newGroup = new Group(this.groupName, this.facultyId, this.specialityId);
            console.log(newGroup);
            this.crudService.insertData(this.entity, newGroup)
                .subscribe(
                    response => {
                        this.refreshData.emit("true");
                        this.groupName = "";
                    },
                    error => this.errorMessage = <any>error,
                );
        }
        else if (this.action === "edit") {
            let editGroup = new Group(this.groupName);
            this.crudService.updateData(this.entity,this.groupId, editGroup)
                .subscribe(
                    (res) => {
                        this.groups.group_name = res[0].group_name;
                    },
                    error => this.errorMessage = <any>error
                );
        }
    }

    close() {
        if(this.action === "create") {
            this.groupName = "";
        } else if(this.action === "edit"){
           this.groupName = this.groups.group_name;
        }
    }

    //methods for addedit action
    getIdFacultyByName($event) {
        this.facultyName = $event.currentTarget.value;
        this.faculties.forEach((item)=> {
            if (item.faculty_name == this.facultyName) {
                this.facultyId = item.faculty_id;
            }
        })
    }

    getIdSpecialityByName($event) {
        this.specialityName = $event.currentTarget.value;
        this.specialities.forEach((item)=> {
            if (item.speciality_name == this.specialityName) {
                this.specialityId = item.speciality_id;
            }
        })
    }
    //the end

}