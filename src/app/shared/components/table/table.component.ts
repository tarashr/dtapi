import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
    selector: 'dt-table',
    templateUrl: 'table.component.html',
    styleUrls: ['table.component.css']
})
export class TableComponent implements OnInit {

    @Input() tableData: any;
    @Input() headers: any;
    @Input() actions: any;
    @Input() page: number;
    @Input() limit: number;
    @Output() activate = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    run(entityData: any, action: string) {
        let actionData = Object.assign({}, entityData);
        entityData.action = action;
        this.activate.emit(entityData);
    }

}