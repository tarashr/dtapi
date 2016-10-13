import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

import {LoginService} from "../shared/services/login.service";

@Component({
    selector: "admin-start",
    templateUrl: "admin-start-page.component.html",
    styleUrls: ["admin-start-page.component.css"],
    providers: [LoginService]
})
export class AdminStartPageComponent {
    constructor(private _loginService:LoginService,
                private _router:Router) {
    }

    ngOnInit() {
        let userRole:string = localStorage.getItem("userRole");
        if (!userRole && userRole != "admin") {
            this._router.navigate(["/login"]);
        }
    }

    logout() {
        this._loginService.logout();
        localStorage.removeItem("userRole");
        this._router.navigate(["/login"]);
    }
}
