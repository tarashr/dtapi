import {Component} from "@angular/core";
import {Router} from "@angular/router";

import {User} from "./../shared/classes/user";
import {LoginService} from "./../shared/services/login.service";

@Component({
    selector: "login-form",
    templateUrl: "login.component.html",
    styleUrls: ["login.component.css"]
})

export class LoginComponent {

    public user:User = new User();
    public loginMessage:boolean = false;

    constructor(private _loginService:LoginService,
                private _router:Router) {
    }

    onSubmit():void {
        this._loginService.login(this.user)
            .subscribe((response:any)=> {
                    if (response.roles && (response.roles[1] === "student")) {
                        sessionStorage.setItem("userRole", response.roles[1]);
						sessionStorage.setItem("userId", response.id);
                        this._router.navigate(["/student"]);
                    } else if (response.roles && (response.roles[1] === "admin")) {
                        sessionStorage.setItem("userRole", response.roles[1]);
                        this._router.navigate(["/admin"]);
                    } else {
                        this.loginMessage = true;
                    }
                },
                (error:any)=> {
                    console.log("$$$ " + error.response);
                    if (error.response === "Invalid login or password") {
                        this.loginMessage = true;
                    }
                })
    }

    delWarning():void {
        this.loginMessage = false;
    }
}
