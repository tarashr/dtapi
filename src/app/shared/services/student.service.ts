import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Router} from "@angular/router";
import {baseUrl}         from "../constants.ts";
import {EntityManagerBody} from "../classes/entity-manager-body";
import {Observable} from 'rxjs';
import '../rxjs-operators';

@Injectable()
export class StudentService {

    private hostUrlBase:string = baseUrl;

    constructor(private _http:Http,
                private _router:Router) {
    }

    /*constructor(private _http:Http,
                private router:Router) {
    };*/

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    /*private successResponse = (response:Response)=>response.json();*/

    /*getEntityValues(data:EntityManagerBody):Observable<any> {
        return this._http
            .post(`${this.hostUrlBase}/EntityManager/getEntityValues`, JSON.stringify(data))
            .map(this.successResponse)
            .catch(this.handleError);
    }*/

}