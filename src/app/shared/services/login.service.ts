import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {InfoModalComponent} from "../components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../classes/user";
import {loginUrl} from "../constants";
import {logoutUrl} from "../constants";
import {
    modalInfoConfig,
    successEventModal,
    badLoginOrPasswordMessage,
    badLogoutMessage,
    serverErrorMessage
} from "../constant";

@Injectable()
export class LoginService {
    private modalInfoConfig: any = modalInfoConfig;
    private loginUrl: string = loginUrl;
    private logoutUrl: string = logoutUrl;
    private badLoginOrPasswordMessage: string = badLoginOrPasswordMessage;
    private badLogoutMessage: string = badLogoutMessage;
    private serverErrorMessage: string = serverErrorMessage;
    private _headers = new Headers({"content-type": "application/json"});

    constructor(private _router: Router,
                private _http: Http,
                private modalService: NgbModal) {
    };

    private successEventModal = successEventModal;

    private handleError = (error: any): Observable<any> => {
        return Observable.throw(error.status);
    };

    private success = (response: Response) => response.json();

    private successLogout = (response: Response) => {
        if (response.status === 200) {
            sessionStorage.removeItem("userRole");
            sessionStorage.removeItem("userId");
            this._router.navigate(["/login"]);
        }
    };

    login(user: User) {
        this._http
            .post(this.loginUrl, JSON.stringify(user), {headers: this._headers})
            .map(this.success)
            .catch(this.handleError)
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
                    if (error === 400) {
                        this.modalInfoConfig.infoString = this.badLoginOrPasswordMessage;
                        this.successEventModal();
                    } else {
                        this.modalInfoConfig.infoString = this.serverErrorMessage;
                        this.successEventModal();
                    }
                });
    };

    logout(): void {
        this._http
            .get(this.logoutUrl)
            .catch(this.handleError)
            .subscribe(this.successLogout,
                () => {
                    sessionStorage.removeItem("userRole");
                    sessionStorage.removeItem("userId");
                    this.modalInfoConfig.infoString = this.badLogoutMessage;
                    this.modalInfoConfig.action = "info";
                    this.modalInfoConfig.title = "Попередження!";
                    const modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
                    modalRef.componentInstance.config = this.modalInfoConfig;
                    modalRef.result
                        .then(() => {
                            return;
                        }, () => {
                            this._router.navigate(["/login"]);
                        });
                });
    }

}
