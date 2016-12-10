import {Injectable}      from "@angular/core";
import {Router} from "@angular/router";
import {Http, Response}  from "@angular/http";
import {Observable}      from "rxjs/Observable";
import {baseUrl}         from "../constant";


@Injectable()
export class StudentPageService {
	
	private hostUrlBase: string = baseUrl;
	private successResponse = (response: Response) => response.json();

	constructor(private http:Http,
                private router:Router) {
    };
	
     private handleError = (error: any) => {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "Server error";
        if (error.status === 403) {
            sessionStorage.removeItem("userRole");
            this.router.navigate(["/login"]);
        }
        return Observable.throw(errMsg);
    };

	 getStudentTestResults(studentId: number): Observable<any> {
        return this.http
            .get(`${this.hostUrlBase}Result/getRecordsbyStudent/${studentId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getStudentTestPassedCount(studentId: number, testId:number): Observable<any> {
        return this.http
            .get(`${this.hostUrlBase}Result/countTestPassesByStudent/${studentId}/${testId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getTimeStamp(mili) {
        mili = +mili * 1000;
        let myDate = new Date(mili);
        let formatDate = {
            date: myDate.getFullYear() + "-" + ("0" + (myDate.getMonth() + 1)).slice(-2) +
            "-" + ("0" + myDate.getDate()).slice(-2),

            time: ("0" + (myDate.getHours() + 1)).slice(-2) + "-" + ("0" + (myDate.getMinutes() + 1)).slice(-2) +
            "-" + ("0" + myDate.getSeconds()).slice(-2)
        };
        return formatDate;
    }

}