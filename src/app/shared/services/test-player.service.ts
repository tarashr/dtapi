import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {baseUrl, getAnswersByQuestionTestPlayerUrl, checkSAnswerUrl}  from "../constant";

@Injectable()
export class TestPlayerService {

    private hostUrlBase: string = baseUrl;
    private getAnswersByQuestionUrl: string = getAnswersByQuestionTestPlayerUrl;
    private checkSAnswerUrl: string = checkSAnswerUrl;
    private headersCheckSAnswer = new Headers({"content-type": "application/json"});

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

    getAnswersByQuestion(questionId: number): Observable<any> {
        return this.http
            .get(`${this.getAnswersByQuestionUrl}${questionId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    checkSAnswers(questions: any): Observable<any> {
        let body = this.createBodyCheck(questions);
        return this.http
            .post(this.checkSAnswerUrl, JSON.stringify(body), {headers: this.headersCheckSAnswer})
            .map(this.successResponse)
            .catch(this.handleError);
    }

    createButtons(countOfButtons: number) {
        let navButtons: any[] = [
            {answered: false, name: "01", active: true, className: "btn btn-warning nom-qua"}];
        for (let i = 1; i < countOfButtons; i++) {
            navButtons.push({});
            navButtons[i].answered = false;
            navButtons[i].name = i + 1 < 10 ? `0${i + 1}` : i + 1;
            navButtons[i].className = "btn btn-primary nom-qua";
            navButtons[i].active = false;
        }
        return navButtons;
    }

    getUserRate(results: any[], questions: any[]): number {
        let userRate: number = 0;
        results.forEach((result) => {
            if (result.true === 0) return;
            questions.forEach((question) => {
                if (result.question_id === question.question_id) {
                    userRate += +question.rate;
                }
            });
        });
        return userRate;
    }

    createBodyCheck(questions: any[]) {
        let bodyCheck: any[] = [];
        questions.forEach(question => {
            let data: any = {};
            data.question_id = question.question_id;
            data.answer_ids = [];
            for (let key in question.chosenAnswer) {
                question.chosenAnswer[key] ? data.answer_ids.push(key) : null;
            }
            bodyCheck.push(data);
        });
        return bodyCheck;
    };


}