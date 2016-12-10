import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {Location} from "@angular/common";

@Component({
    selector: "test-bar",
    templateUrl: "test-bar.component.html",
    styleUrls: ["test-bar.component.scss"]
})
export class TestBarComponent implements OnInit {

    @Input() addTitle: string;
    @Input() pageTitle: string;
    @Input() entityName: string;
    @Input() isSelect: boolean;
    @Input() selectLimit: string;
    @Input() noRecords: boolean;
    @Output() activate = new EventEmitter();
    @Output() selectRun = new EventEmitter();
    private config: any = {action: "create"};

    constructor(private location: Location) {
    }

    ngOnInit() {
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
