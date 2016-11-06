import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {InfoModalComponent} from "../shared/components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {modalInfoConfig, successEventModal} from "../shared/constant";

import {User} from "../shared/classes/user";
import {LoginService} from "./../shared/services/login.service";

@Component({
    selector: "login-form",
    templateUrl: "login.component.html",
    styleUrls: ["login.component.css"]
})

export class LoginComponent {
    private modalInfoConfig: any = modalInfoConfig;
    public user: User = new User();

    constructor(private _loginService: LoginService,
                private _router: Router,
                private modalService: NgbModal) {
    }

    private successEventModal = successEventModal;

    onSubmit(): void {
        this._loginService.login(this.user)
            .subscribe((response: any) => {
                    if (response.roles[1] === "student") {
                        sessionStorage.setItem("userRole", response.roles[1]);
                        sessionStorage.setItem("userId", response.id);
                        this._router.navigate(["/student"]);
                    } else if (response.roles[1] === "admin") {
                        sessionStorage.setItem("userRole", response.roles[1]);
                        this._router.navigate(["/admin"]);
                    }
                },
                (error: any) => {
                    if (error === "400 - Bad Request") {
                        this.modalInfoConfig.infoString = `Неправильний логін або пароль`;
                        this.successEventModal();
                    }
                });
    }

}
