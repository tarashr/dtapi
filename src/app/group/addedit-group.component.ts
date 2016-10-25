import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {GroupService}  from '../shared/services/group.service';
import {Group}   from '../shared/classes/group';


@Component({
    selector: 'addedit-group',
    templateUrl: 'addedit-group.component.html',
    styleUrls: ['addedit-group.component.css']
})

export class AddeditGroupComponent {

    errorMessage: string;
    @Input() tittle:string;
    @Input() action: string;
    @Input() groups: Group;
    @Input() facultyId;
    @Input() specialityId;
    @Input() groupName:string;
    @Input() facultyName:string;
    @Input() specialityName:string;
    @Input() groupId:number;
    @Output() refreshData = new EventEmitter();

    constructor(private modalService: NgbModal,
                private GroupService: GroupService) {
    }

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
            this.GroupService.createGroup(newGroup)
                .subscribe(
                    response => {
                        this.refreshData.emit("true");
                        this.groupName = "";
                    },
                    error => this.errorMessage = <any>error,
                );
        }
        else if (this.action === "edit") {
            this.GroupService.updateGroup(this.groupName, this.groupId)
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

}