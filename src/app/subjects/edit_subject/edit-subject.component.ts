import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {SubjectService}  from '../../shared/services/subject.service';
import {Subject}   from '../../shared/classes/subject';


@Component({
    selector: 'edit-subject',
    templateUrl: './edit-subject.component.html',
    styleUrls: ['edit-subject.component.css']
})

export class EditSubjectComponent {
    closeResult: string;
    errorMessage: string;

    @Input() subject;
    @Output() getSubjectsRequest = new EventEmitter();
    @Output() getSubjectsRange = new EventEmitter();

    Tittle: string = "Редагувати дані предмету";
    constructor(
        private modalService: NgbModal,
        private subjectService: SubjectService
    ) {}

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
            return  `with: ${reason}`;
        }
    }

    save():void {
        console.log(this.subject);
        this.subjectService.updateSubject(this.subject, this.subject.subject_id)
            .subscribe(
                () => {
                    this.getSubjectsRange.emit(this.subject);
                    this.subject = {};
                },
                error => this.errorMessage = <any>error
            )
    }

}