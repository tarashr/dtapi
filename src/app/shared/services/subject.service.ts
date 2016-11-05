import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {Router} from "@angular/router";
import '../rxjs-operators';
import {baseUrl}  from "../constants.ts";
import {
    getTestsBySubjectIdUrl,
    getTimeTableForSubjectUrl,
    getTestDetailsByTestUrl,
    getQuestionsByLevelRandUrl,
    getRecordsRangeByTestUrl,
    countRecordsByTestUrl
}  from "../constants.ts";

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

    getTestDetailsByTest(id:number):Observable<any>{
        return this.http.get(`${getTestDetailsByTestUrl}/${id}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getQuestionsByLevelRand(test_id: number, level: number, number: number):Observable<any> {
        return this.http.get(`${getQuestionsByLevelRandUrl}/${test_id}/${level}/${number}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getRecordsRangeByTest(test_id: number, limit: number, offset: number):Observable<any> {
        return this.http.get(`${getRecordsRangeByTestUrl}/${test_id}/${limit}/${offset}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    countRecordsByTest(test_id: number):Observable<any> {
        return this.http.get(`${countRecordsByTestUrl}/${test_id}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }
}