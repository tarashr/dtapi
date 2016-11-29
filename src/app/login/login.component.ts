import {Component} from "@angular/core";

import {User} from "../shared/classes/user";
import {LoginService} from "../shared/services/login.service";

@Component({
    selector: "login-form",
    templateUrl: "login.component.html",
    styleUrls: ["login.component.css"]
})

export class LoginComponent {

    public user: User = new User();

    constructor(private loginService: LoginService) {
    }

    onSubmit(): void {
        this.loginService.login(this.user);
    }

}
