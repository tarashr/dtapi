import {Component, Input} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "modal-add-edit",
    templateUrl: "modal-add-edit.component.html",
    styleUrls: ["modal-add-edit.component.css"]
})
export class ModalAddEditComponent {

    @Input() config: any;

    constructor(private activeModal: NgbActiveModal) {
    }

}