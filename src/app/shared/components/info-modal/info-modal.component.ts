import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'info-modal',
    templateUrl: 'info-modal.component.html',
    styleUrls: ['info-modal.component.css']
})
export class InfoModalComponent{

    @Input() config: any;

    constructor(private activeModal: NgbActiveModal) {
    }
}