import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {Faculty} from "../shared/classes/faculty";
import {CommonService} from "../shared/services/common.service";

@Component({
    selector: 'ngbd-modal-basic',
    templateUrl: './ngbd-modal-basic.component.html',
    styleUrls: ['./ngbd-modal-basic.component.css'],
    providers: [CommonService]
})
export class NgbdModalBasic {
    closeResult:string;
    @Input() facultyName:string;
    @Input() facultyDescription:string;
    @Input() activate:string;
    @Input() title:string;
    @Input() facultyId:number;
    public entity:string = "faculty";
    @Output() refreshData = new EventEmitter();

    constructor(private modalService:NgbModal,
                private _commonService:CommonService) {
    }

    run() {
        if (this.activate === "create") {
            let newFaculty:Faculty = new Faculty(this.facultyName, this.facultyDescription);
            this._commonService.insertData(this.entity, newFaculty)
                .then(response=> console.log(response));
        }
        else if (this.activate === "edit") {
            let editedFaculty:Faculty = new Faculty(this.facultyName, this.facultyDescription);
            this._commonService.updateData(this.entity, this.facultyId, editedFaculty)
                .then(response=> {
                    console.log(response);
                    this.refreshData.emit("true");
                });

        }
    }

    open(content) {
        console.log(`name: ${this.facultyName}, description: ${this.facultyDescription}, id: ${this.facultyId}`)
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason:any):string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }


}