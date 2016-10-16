import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { LoginService } from "../shared/services/login.service";

@Component({
    selector: 'start-page',
    templateUrl: 'start-page.component.html',
    providers: [LoginService]
})

export class StartPageComponent implements OnInit{

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
