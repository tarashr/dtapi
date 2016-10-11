import {Component, OnInit} from "@angular/core";

import { LoginService } from "../shared/services/login.service";

@Component({
    selector: "admin-start",
    templateUrl: "admin-start-page.component.html",
    styleUrls:["admin-start-page.component.css"],
    providers:[LoginService]
})
export class AdminStartPageComponent{
    constructor(
        private _loginService: LoginService

    ) { }

    ngOnInit() {
    }

    logout() {
        this._loginService.logout();
    }
}
