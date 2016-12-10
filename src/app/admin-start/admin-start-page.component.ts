import {Component} from "@angular/core";

import {LoginService} from "../shared/services/login.service.ts";

@Component({
    selector: "admin-start",
    templateUrl: "admin-start-page.component.html",
    styleUrls: ["admin-start-page.component.scss"]
})
export class AdminStartPageComponent {

    constructor(private _loginService: LoginService) {
    }

    logout() {
        this._loginService.logout();
    }
}
