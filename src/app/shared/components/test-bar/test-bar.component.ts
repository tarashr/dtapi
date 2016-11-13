import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from "@angular/core";
import {Location} from "@angular/common";

@Component({
    selector: "test-bar",
    templateUrl: "test-bar.component.html",
    styleUrls: ["test-bar.component.css"]
})
export class TestBarComponent implements OnInit, OnChanges {

    @Input() addTitle: string;
    @Input() pageTitle: string;
    @Input() entityName: string;
    @Input() isSelect: boolean;
    @Input() selectLimit: string;
    @Input() noRecords: boolean;
    public name: string = "";
    @Output() activate = new EventEmitter();
    @Output() selectRun = new EventEmitter();
    private config: any = {action: "create"};

    constructor(private location: Location) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.entityName !== undefined) {
            this.name = this.entityName;
            console.log("bar"+JSON.stringify(this.name));
        }
    }

    addEntity(data: any) {
        this.activate.emit(data);
    }

    goBack(): void {
        this.location.back();
    }

    setupLimit(limit) {
        this.selectRun.emit(limit);
    }

}
