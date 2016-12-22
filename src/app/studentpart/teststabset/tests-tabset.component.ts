import {Component, Input} from "@angular/core";

@Component({
    selector: "ngbd-tabset-tests",
    templateUrl: "./tests-tabset.component.html"
})

export class TestsTabsetComponent {
    @Input() groupName;
    @Input() groupId;
    @Input() userId;
}


