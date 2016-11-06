import {Injectable}     from "@angular/core";
import {CanActivate, Router}    from "@angular/router";
import {InfoModalComponent} from "../components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {modalInfoConfig, successEventModal} from "../constant";

@Injectable()
export class AuthStudentGuard implements CanActivate {
    private modalInfoConfig: any = modalInfoConfig;

    constructor(private router: Router, private modalService: NgbModal) {
    }

    canActivate(): boolean {
        return this.checkLogin();
    }

    private successEventModal = successEventModal;

    checkLogin() {
        if (sessionStorage.getItem("userRole") === "student") return true;
        this.modalInfoConfig.infoString = `Введіть логін та пароль`;
        this.successEventModal();
        this.router.navigate(["/login"]);
        return false;
    }
}