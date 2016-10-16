import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Subject }   from '../classes/subject'

@Injectable()
export class SubjectService {

    private subjectUrl = 'http://dtapi.local/subject/getRecords';  // URL to web api

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    constructor(private http: Http) { }

    getSubjects(): Promise<Subject[]> {
        return this.http.get(this.subjectUrl)
            .toPromise()
            .then(response => response.json() as Subject[])
            .catch(this.handleError);
    }

}