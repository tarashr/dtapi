import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {Subject}   from '../../shared/classes/subject';
import { CRUDService } from '../../shared/services/crud.service';

@Component({
    selector: 'addedit-subject',
    templateUrl: 'addedit-subject.component.html',
    styleUrls: ['addedit-subject.component.css']
})

export class AddeditSubjectComponent {
    public errorMessage: string;
    public entity: string = "subject";

    @Input() tittle:string;
    @Input() action: string;
    @Input() subject: Subject;
    @Input() subjectName:string;
    @Input() subjectDescription:string;
    @Input() subjectId:number;
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
            let newSubject = new Subject(this.subjectName, this.subjectDescription);
            this.crudService.insertData(this.entity, newSubject)
                .subscribe(
                    response => {
                        this.refreshData.emit("true");
                        this.subjectName = "";
                        this.subjectDescription = "";
                    },
                    error => this.errorMessage = <any>error,
                );
        } else if (this.action === "edit") {
            let editedSubject: Subject = new Subject(this.subjectName, this.subjectDescription);
            this.crudService.updateData(this.entity, this.subjectId, editedSubject)
                .subscribe(
                    (res) => {
                        this.subject.subject_name = res[0].subject_name;
                        this.subject.subject_description = res[0].subject_description;

                    },
                    error => this.errorMessage = <any>error
                );
        }
    }

    close() {
        if(this.action === "create") {
            this.subjectName = "";
            this.subjectDescription = "";
        } else if(this.action === "edit"){
            this.subjectName = this.subject.subject_name;
            this.subjectDescription = this.subject.subject_description;
        }
    }

}