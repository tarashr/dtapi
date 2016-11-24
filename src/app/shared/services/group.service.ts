import {Injectable}      from "@angular/core";
import {Router} from "@angular/router";
import {Http, Response}  from "@angular/http";
import {Observable}      from "rxjs/Observable";
import {baseUrl}         from "../constant";

@Injectable()
export class GroupService {

    private hostUrlBase: string = baseUrl;
    private successResponse = (response: Response) => response.json();

    constructor(private http: Http,
                private router: Router) {
    }

    private handleError = (error: any) => {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "Server error";
        if (error.status === 403) {
            sessionStorage.removeItem("userRole");
            this.router.navigate(["/login"]);
        }
        return Observable.throw(errMsg);
    };

    getTimeTablesForGroup(groupId: number): Observable<any> {
        return this.http
            .get(`${this.hostUrlBase}timeTable/getTimeTablesForGroup/${groupId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getTestByGroup(groupId: number): Observable<any> {
        return this.http
            .get(`${this.hostUrlBase}Result/getResultTestIdsByGroup/${groupId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getTestResult(testId: number, groupId: number): Observable<any> {
        return this.http
            .get(`${this.hostUrlBase}Result/getRecordsByTestGroupDate/${testId}/${groupId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    toNationalRate(result: number, maxResult: number): string {
        const relResult: number = (result / maxResult) * 100;
        if (relResult >= 0 && relResult < 60) {
            return "Незадовільно";
        } else if (relResult >= 60 && relResult < 74) {
            return "Задовільно";
        } else if (relResult >= 74 && relResult < 90) {
            return "Добре";
        } else if (relResult >= 90 && relResult <= 100) {
            return "Відмінно";
        } else {
            return "Неправильні дані";
        }
    }

    toECTSRate(result: number, maxResult: number): string {
        const relResult: number = (result / maxResult) * 100;
        if (relResult >= 0 && relResult < 40) {
            return "F";
        } else if (relResult >= 40 && relResult < 60) {
            return "FX";
        } else if (relResult >= 60 && relResult < 64) {
            return "E";
        } else if (relResult >= 64 && relResult < 74) {
            return "D";
        } else if (relResult >= 74 && relResult < 82) {
            return "C";
        } else if (relResult >= 82 && relResult < 90) {
            return "B";
        } else if (relResult >= 90 && relResult <= 100) {
            return "A";
        } else {
            return "Неправильні дані";
        }
    }
}