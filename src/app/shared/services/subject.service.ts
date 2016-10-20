import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import '../rxjs-operators';

import {Subject}   from '../classes/subject'
import *as url from '../constants_url';

@Injectable()
export class SubjectService {

    ////properties////
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    public getSubjects(): Observable<Subject[]> {
        return this.http
            .get(url.getSubjectsUrl)
            .map((res: Response) => res.json())
            .do((response) => console.log(JSON.stringify(response)))
            .catch(this.handleError);
    }

    public deleteSubject(id: number): Observable<any> {
        return this.http.delete(`${url.delSubjectUrl}/${id}`, {headers: this.headers})
            .catch(this.handleError);
    }

    public updateSubject(subject, subject_id): Observable<any> {
        return this.http.post(`${url.editSubjectUrl}/${subject_id}`, JSON.stringify(subject), {headers: this.headers})
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    public createSubject(subject): Observable<Subject[]> {
        return this.http.post(`${url.addSubjectUrl}`, JSON.stringify(subject), {headers: this.headers})
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    public getSubjectsRange(limit:number, offset:number): Observable<Subject[]> {
        return this.http.get(`${url.getRangeOfSubjectsUrl}/${limit}/${offset}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    public getcoutSubjects(): Observable<any>{
        return this.http.get(`${url.countSubjectsUrl}`)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    public getSubjectsbySearch(criteria):Observable<any>{
        return this.http.get(`${url.getSubjectsBySearchUrl}/${criteria}`)
            .map(res => res.json())
            .catch(this.handleError);
    }
}