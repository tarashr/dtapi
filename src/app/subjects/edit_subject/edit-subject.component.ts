import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {SubjectService}  from '../../shared/services/subject.service';
import {Subject}   from '../../shared/classes/subject';


@Component({
    selector: 'edit-subject',
    templateUrl: './edit-subject.component.html',
    styleUrls: ['edit-subject.component.css']
})

export class EditSubjectComponent {
    Tittle: string = "Редагувати дані предмету";
    closeResult: string;
    errorMessage: string;

    @Input() subject: Subject;
    @Input() subjectName;
    @Input() subjectDescription;
    @Input() subjectId;
    @Output() refreshData = new EventEmitter();
    @Output() getcountSubjects = new EventEmitter();

    constructor(private modalService: NgbModal,
                private subjectService: SubjectService) {
    }


    open(content) {
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
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

    save(): void {
        let editedSubject: Subject = new Subject(this.subjectName, this.subjectDescription);
        this.subjectService.updateSubject(editedSubject, this.subjectId)
            .subscribe(
                (res) => {
                    this.subject.subject_name = res[0].subject_name;
                    this.subject.subject_description = res[0].subject_description;

                },
                error => this.errorMessage = <any>error
            )
    }

    close() {
        this.subjectName = this.subject.subject_name;
        this.subjectDescription = this.subject.subject_description;

    }

}

