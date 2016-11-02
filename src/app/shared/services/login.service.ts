import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import {InfoModalComponent} from "../components/info-modal/info-modal.component";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from "../classes/user";
import {loginUrl} from "../constants";
import {logoutUrl} from "../constants";

@Injectable()
export class LoginService {

    private loginUrl: string = loginUrl;
    private logoutUrl: string = logoutUrl;
    private modalInfoConfig: any = {};

    private _headers = new Headers({"content-type": "application/json"});

    constructor(private _router: Router,
                private _http: Http,
                private modalService: NgbModal) {
    };

    private handleError = (error: any): Observable<any>=> {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    };

    private success = (response: Response)=>response.json();

    private successLogout = (response: Response)=> {
        if (response.status == 200) {
            sessionStorage.removeItem("userRole");
            sessionStorage.removeItem("userId");
            this._router.navigate(["/login"]);
        }
    };

    login(user: User): Observable<any> {
        return this._http
            .post(this.loginUrl, JSON.stringify(user), {headers: this._headers})
            .map(this.success)
            .catch(this.handleError)
    };

    logout(): void {
        this._http
            .get(this.logoutUrl)
            .catch(this.handleError)
            .subscribe(this.successLogout,
                ()=> {
                    this.modalInfoConfig.infoString = `Виникла помилка в процесі виходу. Спробуйте вийти повторно`;
                    this.modalInfoConfig.action = "info";
                    this.modalInfoConfig.title = "Попередження";
                    const modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
                    modalRef.componentInstance.config = this.modalInfoConfig;
                })
    }

}
