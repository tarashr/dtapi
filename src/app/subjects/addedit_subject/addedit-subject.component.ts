import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {SubjectService}  from '../../shared/services/subject.service';
import {Subject}   from '../../shared/classes/subject';


@Component({
    selector: 'addedit-subject',
    templateUrl: 'addedit-subject.component.html',
    styleUrls: ['addedit-subject.component.css']
})

export class AddeditSubjectComponent {
    Tittle: string = "Додати новий предмет";
    closeResult: string;
    errorMessage: string;

    @Input() action: string;
    @Input() subject: Subject;
    @Input() subjectName:string;
    @Input() subjectDescription:string;
    @Input() subjectId:number;
    @Output() getSubjectsRequest = new EventEmitter();
    @Output() refreshData = new EventEmitter();
    @Output() getcountSubjects = new EventEmitter();


    constructor(private modalService: NgbModal,
                private subjectService: SubjectService) {
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
            let newSubject = new Subject(this.subjectName, this.subjectDescription);
            this.subjectService.createSubject(newSubject)
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
            this.subjectService.updateSubject(editedSubject, this.subjectId)
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