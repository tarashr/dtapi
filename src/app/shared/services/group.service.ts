import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import '../rxjs-operators';

import {Subject}   from '../classes/subject'
import *as url from '../constants';

@Injectable()
export class GroupService {

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(
        private http: Http
    ) {}

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}