import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {Faculty} from "../shared/classes/faculty";
import {CommonService} from "../shared/services/common.service";

@Component({
    selector: 'ngbd-modal-basic',
    templateUrl: './ngbd-modal-basic.component.html',
    styleUrls: ['./ngbd-modal-basic.component.css']
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
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData.emit("true");
                });
        }
        else if (this.activate === "edit") {
            let editedFaculty:Faculty = new Faculty(this.facultyName, this.facultyDescription);
            this._commonService.updateData(this.entity, this.facultyId, editedFaculty)
                .subscribe(response=> {
                    console.log(response);
                    this.refreshData.emit("true");
                });
        }
    }

    open(content) {
        this.modalService.open(content);
    }
}