import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
// import {Observable}  from 'rxjs';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';

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

    private search:string = "";
    private searchTerms = new Subject();
    public searchControl:FormControl = new FormControl();

    constructor() {
    }

    find(term:string) {
        this.searchTerms.next(term);
    }

    ngOnInit() {
        this.searchTerms
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(newValue => {
                this.search = newValue;
                this.findEntity()
            });
    }

    findEntity() {
        this.searchRun.emit(this.search);
    }

    modal(data:any) {
        this.activate.emit(data);
    }

    changeLimit(limit:number) {
        this.selectRun.emit(limit);
    }


}