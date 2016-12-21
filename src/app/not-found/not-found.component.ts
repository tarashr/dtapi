import {Component} from "@angular/core";
import {Location} from "@angular/common";

@Component({
    templateUrl: "not-found.component.html"
})

export class NotFoundComponent {

    constructor(private location: Location) {
    }

    back() {
        this.location.back();
    }
}
