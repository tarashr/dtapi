import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
    selector: 'entity-bar',
    templateUrl: 'entity-bar.component.html',
    styleUrls: ['entity-bar.component.css']
})
export class EntityBarComponent implements OnInit {

    @Input() entityTitle:string;
    @Input() searchTitle:string;
    @Input() configAdd:string;
    @Input() selectLimit:string;
    @Input() entityDataLength:number;
    @Output() activate = new EventEmitter();
    @Output() searchRun = new EventEmitter();
    @Output() selectRun = new EventEmitter();

    constructor() {
    }

    ngOnInit() {

    }

    findEntity(search:string){
        this.searchRun.emit(search);
    }
    
    modal(data:any) {
        this.activate.emit(data);
    }
    
    changeLimit(limit:number){
        this.selectRun.emit(limit);
    }
    

}