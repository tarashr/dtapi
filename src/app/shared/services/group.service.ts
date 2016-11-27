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

    toNationalRate(resultInPercentage): string {
        if (resultInPercentage >= 0 && resultInPercentage < 60) {
            return "Незадовільно";
        } else if (resultInPercentage >= 60 && resultInPercentage < 74) {
            return "Задовільно";
        } else if (resultInPercentage >= 74 && resultInPercentage < 90) {
            return "Добре";
        } else if (resultInPercentage >= 90 && resultInPercentage <= 100) {
            return "Відмінно";
        } else {
            return "Неправильні дані";
        }
    }

    toECTSRate(resultInPercentage ): string {
        if (resultInPercentage >= 0 && resultInPercentage < 40) {
            return "F";
        } else if (resultInPercentage >= 40 && resultInPercentage < 60) {
            return "FX";
        } else if (resultInPercentage >= 60 && resultInPercentage < 64) {
            return "E";
        } else if (resultInPercentage >= 64 && resultInPercentage < 74) {
            return "D";
        } else if (resultInPercentage >= 74 && resultInPercentage < 82) {
            return "C";
        } else if (resultInPercentage >= 82 && resultInPercentage < 90) {
            return "B";
        } else if (resultInPercentage >= 90 && resultInPercentage <= 100) {
            return "A";
        } else {
            return "Неправильні дані";
        }
    }
}