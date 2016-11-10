import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {Router} from "@angular/router";
import '../rxjs-operators';
import {
    baseUrl
}  from "../../shared/constants";

@Injectable()
export class StudentPageService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private hostUrlBase: string = baseUrl;
    private successResponse = (response: Response)=>response.json();

    constructor(private http: Http,
                private router: Router) {
    }

    private handleError = (error: any)=> {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        if (error.status == "403") {
            sessionStorage.removeItem("userRole");
            this.router.navigate(['/login'])
        }
        return Observable.throw(errMsg);
    };

    getTimeStamp() {

        var myDate = new Date();
        var formatDate = myDate.getFullYear() + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) +
            '-' + ('0' + myDate.getDate()).slice(-2);
        return formatDate;
    }


}