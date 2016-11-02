import {Component, Input, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'info-modal',
    templateUrl: 'info-modal.component.html',
    styleUrls: ['info-modal.component.css']
})
export class InfoModalComponent implements OnInit {

    @ViewChild('modalWindow') modalWindow;

    @Input() infoString: string;
    @Input() config: any;
    @Output() activate = new EventEmitter();

    constructor(private modalService: NgbModal) {
    }

    ngOnInit() {
    }

    // run() {
    //     this.activate.emit("true");
    // }
    //
    // open(content) {
    //     this.modalService.open(content, {size: "sm"}).result
    //         .then(() => {
    //                 this.activate.emit("true");
    //             },
    //             () => {
    //                 this.activate.emit("false");
    //             })
    // }

}