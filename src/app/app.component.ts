import {Component, ViewEncapsulation} from "@angular/core";

@Component({
    selector: "my-app",
    encapsulation: ViewEncapsulation.None,
    template: "<router-outlet></router-outlet>",
    styleUrls: ["../assets/style/style.scss"]
})

export class AppComponent {

}
