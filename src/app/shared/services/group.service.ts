import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import '../rxjs-operators';

import {Group}   from '../classes/group'
import *as url from '../constants_url';


@Injectable()
export class GroupService {
constructor( private http:Http){}


    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    public getGroups(): Observable<Group[]>{
        return this.http
            .get(url.getGroupUrl)
            .map((res: Response) => res.json())
            .do((response) => {console.log(JSON.stringify(response));})
            .catch(this.handleError);
    }
    public getFacultyName(groups):Observable<any>{
        return this.http
            .get('http://dtapi.local/getRecords/${groups.faculty_id}')
            .map((res:Response)=>res.json())
            .catch(this.handleError);
    }

}