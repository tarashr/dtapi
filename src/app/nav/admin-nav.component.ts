import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "../shared/services/login.service";

@Component({
    selector: "admin-nav",
    templateUrl: "admin-nav.component.html",
    styleUrls: "admin-nav.component.css"
})


export class AdminNavComponent implements OnInit {

    constructor(
        private _loginService: LoginService,
        private _router: Router
    ) { }

    private success(response:any){
        if (response.response==="non logged") {
            this._router.navigate(["/login"]);
        }
    }

    ngOnInit() {

    }

    logout() {
        this._loginService.logout();
    }
}