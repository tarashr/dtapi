import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import  {Headers, Http, Response} from "@angular/http";
import {Observable}     from 'rxjs';
// import "rxjs";

import {User} from "../classes/user";

@Injectable()
export class LoginService {

    private loginUrl:string = "http://dtapi.local/login/index";
    private logoutUrl:string = "http://dtapi.local/login/logout";

    private _headers = new Headers({"content-type": "application/json"});

    constructor(private _router:Router,
                private _http:Http) {
    };

    private handleError(error:any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    login(user:User):Observable<any> {
        return this._http
            .post(this.loginUrl, JSON.stringify(user), {headers: this._headers})
            .map((response:Response)=>response.json())
            .catch(this.handleError)
    };

    logout():Observable<any> {
        return this._http
            .get(this.logoutUrl)
    }

}
