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

    formPieChartData(data: string[]): {}[] {
        let countPerfect: number = 0;
        let countGood: number = 0;
        let countSatisfactorily: number = 0;
        let countNotSatisfactorily: number = 0;
        const charData: any = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i] === "Відмінно") {
                countPerfect++;
            }
            if (data[i] === "Добре") {
                countGood++;
            }
            if (data[i] === "Задовільно") {
                countSatisfactorily++;
            }
            if (data[i] === "Незадовільно") {
                countNotSatisfactorily++;
            }
        }

        if (countPerfect) {
            charData.push({name: "Відмінно", y: (100 * countPerfect) / data.length});
        }

        if (countGood) {
            charData.push({name: "Добре", y: (100 * countGood) / data.length});
        }

        if (countSatisfactorily) {
            charData.push({name: "Задовільно", y: (100 * countSatisfactorily) / data.length});
        }

        if (countNotSatisfactorily) {
            charData.push({name: "Незадовільно", y: (100 * countNotSatisfactorily) / data.length});
        }
        return charData;
    }
}