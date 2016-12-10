import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {User} from "../classes/user";
import {loginUrl} from "../constant";
import {logoutUrl} from "../constant";
import {
    badLoginOrPasswordMessage,
    badLogoutMessage,
    serverErrorMessage
} from "../constant";
import {CommonService} from "./common.service";
import {TestPlayerService} from "./test-player.service";

@Injectable()
export class LoginService {
    private loginUrl: string = loginUrl;
    private logoutUrl: string = logoutUrl;
    private badLoginOrPasswordMessage: string = badLoginOrPasswordMessage;
    private badLogoutMessage: any = badLogoutMessage;
    private serverErrorMessage: string = serverErrorMessage;
    private _headers = new Headers({"content-type": "application/json"});

    constructor(private _router: Router,
                private _http: Http,
                private commonService: CommonService,
                private testPlayerService: TestPlayerService) {
    };

    private handleError = (error: any): Observable<any> => {
        return Observable.throw(error);
    };

    private successRequest = (response: Response) => response.json();

    private successLogin = (response: any) => {
        const dTester: any = JSON.parse(localStorage.getItem("dTester"));
        if (dTester) {
            const userIdHash: string = this.commonService.cryptData(+response.id);
            if (userIdHash !== dTester.userId) {
                localStorage.removeItem("dTester");
                this.testPlayerService.resetSessionData();
            }
        }
        if (response.roles[1] === "student") {
            sessionStorage.setItem("userRole", response.roles[1]);
            sessionStorage.setItem("userId", response.id);
            this._router.navigate(["/student"]);
        } else if (response.roles[1] === "admin") {
            sessionStorage.setItem("userRole", response.roles[1]);
            this._router.navigate(["/admin"]);
        }
    }

    private errorLogin = (error) => {
        if (error.json().response === "Invalid login or password") {
            this.commonService.openModalInfo(this.badLoginOrPasswordMessage);
        } else {
            this.commonService.openModalInfo(this.serverErrorMessage);
        }
    }

    private successLogout = (response: Response) => {
        if (response.status === 200) {
            sessionStorage.removeItem("userRole");
            sessionStorage.removeItem("userId");
            this._router.navigate(["/login"]);
        }
    };

    private errorLogout = () => {
        this.commonService.openModalInfo(...this.badLogoutMessage)
            .then(() => {
            }, () => {
                sessionStorage.removeItem("userRole");
                sessionStorage.removeItem("userId");
                this._router.navigate(["/login"]);
            });
    }

    login(user: User) {
        this._http
            .post(this.loginUrl, JSON.stringify(user), {headers: this._headers})
            .map(this.successRequest)
            .catch(this.handleError)
            .subscribe(this.successLogin, this.errorLogin);
    };

    logout(): void {
        this._http
            .get(this.logoutUrl)
            .catch(this.handleError)
            .subscribe(this.successLogout, this.errorLogout);
    }

}
