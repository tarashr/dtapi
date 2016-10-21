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
    @Input() subjectName;
    @Input() subjectDescription;
    @Output() getSubjectsRequest = new EventEmitter();
    @Output() refreshData = new EventEmitter();


    constructor(
        private modalService: NgbModal,
        private subjectService: SubjectService
    ){}

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
        let newSubject = new Subject(this.subjectName, this.subjectDescription);
        this.subjectService.createSubject(newSubject)
            .subscribe(
                response => {
                    this.refreshData.emit("true");
                },
                error => this.errorMessage = <any>error,
            )
    }

    close(){
        this.subjectName = "";
        this.subjectDescription = "";
    }

}