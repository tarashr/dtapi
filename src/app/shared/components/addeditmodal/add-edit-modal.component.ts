import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'add-edit-modal',
    templateUrl: 'add-edit-modal.component.html',
    styleUrls: ['add-edit-modal.component.css']
})
export class AddEditModalComponent implements OnInit {

    public data:any;

    @Input() name:string;
    @Input() description:string;
    @Input() email:string;
    @Input() code:string;
    @Input() id:number;
    @Input() config:any;
    @Output() activate = new EventEmitter();

    constructor(private modalService:NgbModal) {
    }

    ngOnInit() {
        this.data = Object.assign({}, this.config);
    }

    run(action:string) {
        this.activate.emit(this.data);
        this.data.list.forEach(item=>item.value = "");
    }

    open(content) {
        if (this.id) this.data.id = this.id;

        this.data.list.forEach((item)=> {
            if (item.title === "name") {
                item.value = this.name;
            }
            if (item.title === "description") {
                item.value = this.description
            }
            if (item.title === "email") {
                item.value = this.email
            }
            if (item.title === "code") {
                item.value = this.code
            }
        });

        this.modalService.open(content);
    }

}