import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import '../rxjs-operators';

import {Group}   from '../classes/group'
import *as url from '../constants_url';


@Injectable()
export class GroupService {
constructor( private http:Http){}


    private handleError(error: any) {
            let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }


    public getCountRecords():Observable<any>{
        return this.http
            .get(url.countGroupsUrl)
            .map((res:Response)=>res.json())
            .do((response) => {console.log(JSON.stringify(response));})
            .catch(this.handleError);
}

    getRecordsRange(limit:number, offset:number):Observable<any> {
        return this.http
            .get(`${url.getRangeOfGroupUrl}/${limit}/${offset}`)
            .map((data:Response)=>data.json())
            .do((response) => {console.log(JSON.stringify(response));})
            .catch(this.handleError);
    }


}