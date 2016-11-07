import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {baseUrl, getAnswersByQuestionTestPlayerUrl}  from "../constant";

@Injectable()
export class TestPlayerService {

    private hostUrlBase: string = baseUrl;
    private getAnswersByQuestionUrl: string = getAnswersByQuestionTestPlayerUrl;

    constructor(private http: Http,
                private router: Router) {
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

    private successResponse = (response: Response) => response.json();

    getAnswersByQuestion(questionId: number) {
        return this.http
            .get(`${this.getAnswersByQuestionUrl}${questionId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }


}