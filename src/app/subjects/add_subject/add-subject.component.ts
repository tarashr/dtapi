import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {SubjectService}  from '../../shared/services/subject.service';
import {Subject}   from '../../shared/classes/subject';


@Component({
    selector: 'add-subject',
    templateUrl: './add-subject.component.html',
    styleUrls: ['add-subject.component.css']
})

export class AddSubjectComponent {

    Tittle: string = "Додати новий предмет";
    closeResult: string;
    errorMessage: string;
    subject = {};
    @Input() subjects: Subject;
    @Output() getSubjectsRequest = new EventEmitter();
    @Output() getSubjectsRange = new EventEmitter();


    constructor(
        private modalService: NgbModal,
        private subjectService: SubjectService
    ){}

    //this method opens the modal window
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

    createSubject(): void {
        console.log(this.subject);
        this.subjectService.createSubject(this.subject)
            .subscribe(
                response => {
                    this.getSubjectsRange.emit(this.subjects);
                    console.log(response);
                    this.subject = {};
                },
                error => this.errorMessage = <any>error,
            )

    }

}