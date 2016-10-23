import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import {User} from "../classes/user";
import {loginUrl} from "../constants";
import {logoutUrl} from "../constants";

@Injectable()
export class LoginService {

    private loginUrl:string = loginUrl;
    private logoutUrl:string = logoutUrl;

    private _headers = new Headers({"content-type": "application/json"});

    constructor(private _router:Router,
                private _http:Http) {
    };

    private handleError(error:any):Observable<any> {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }

    login(user:User):Observable<any> {
        return this._http
            .post(this.loginUrl, JSON.stringify(user), {headers: this._headers})
            .map((response:Response)=>response.json())
            .catch(this.handleError)
    };

    logout():void {
        this._http
            .get(this.logoutUrl)
            .subscribe();
        localStorage.clear();
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("userId");
        this._router.navigate(["/login"]);
    }

}
