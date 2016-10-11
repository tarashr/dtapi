import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import  {Headers, Http} from "@angular/http";
import "rxjs/add/operator/toPromise";

import {User} from "../classes/user";

@Injectable()
export class LoginService {

    private loginUrl:string = "http://dtapi.local/login/index";
    private logoutUrl:string = "http://dtapi.local/login/logout";

    private _headers = new Headers({"content-type": "application/json"});

    constructor(private _router:Router,
                private _http:Http) {
    };

    login(user:User):Promise<any> {
        return this._http
            .post(this.loginUrl, JSON.stringify(user), {headers: this._headers})
            .toPromise()
            .then((response:any)=>response.json())
            .catch((error:any)=> {
                console.error("!!!login error: ", error);
                return Promise.reject(error.json() || error.message);
            });
    }

    logout() {
        this._http.get(this.logoutUrl);
        this._router.navigate(["/login"]);
    }

}
