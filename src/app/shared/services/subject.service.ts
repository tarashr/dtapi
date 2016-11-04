import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {Router} from "@angular/router";
import '../rxjs-operators';
import {baseUrl}  from "../constants.ts";
import {getTestsBySubjectIdUrl, getTimeTableForSubjectUrl}  from "../constants.ts";
import {EntityManagerBody} from "../classes/entity-manager-body";
import {Test}   from '../classes/test'
import *as url from '../constants';

@Injectable()
export class SubjectService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private hostUrlBase: string = baseUrl;
    private successResponse = (response:Response)=>response.json();

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

    getTestsBySubjectId(entity:string, id:number):Observable<any> {
        return this.http
            .get(`${getTestsBySubjectIdUrl}/${id}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getTimeTableForSubject(entity:string, id:number):Observable<any>{
        return this.http.get(`${getTimeTableForSubjectUrl}/${id}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }
}