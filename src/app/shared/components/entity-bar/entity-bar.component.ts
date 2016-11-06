import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {Subject} from "rxjs";

@Component({
    selector: "entity-bar",
    templateUrl: "entity-bar.component.html",
    styleUrls: ["entity-bar.component.css"]
})
export class EntityBarComponent implements OnInit {

    @Input() addTitle: string;
    @Input() entityTitle: string;
    @Input() searchTitle: string;
    @Input() selectLimit: string;
    @Input() entityDataLength: number;
    @Input() facultyList: string[];
    @Input() specialityList: string[];
    @Output() activate = new EventEmitter();
    @Output() searchRun = new EventEmitter();
    @Output() selectRun = new EventEmitter();
    private config: any = {action: "create"};
    private searchTerms = new Subject();

    constructor() {
    }

    find(term: string) {
        this.searchTerms.next(term);
    }

    ngOnInit() {
        this.searchTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(newValue => {
                this.searchRun.emit(newValue);
            });
    }

    onSelect(data): void {
        alert(data);
    }

    modal(data: any) {
        this.activate.emit(data);
    }

    changeLimit(limit: number) {
        this.selectRun.emit(limit);
    }


}