import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {getAnswersByQuestionTestPlayerUrl, checkSAnswerUrl, navButtonConstClassName}  from "../constant";
import {TestPlayerNavButton} from "../classes/test-player-nav-buttons";
import {TestPlayerQuestions} from "../classes/test-player-questions";
import {TestPlayerDtapiResult} from "../classes/test-player-dtapi-result";

@Injectable()
export class TestPlayerService {

    private getAnswersByQuestionUrl: string = getAnswersByQuestionTestPlayerUrl;
    private checkSAnswerUrl: string = checkSAnswerUrl;
    private navButtonConstClassName: string = navButtonConstClassName;
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

    getAnswersByQuestion(questionId: string): Observable<any> {
        return this.http
            .get(`${this.getAnswersByQuestionUrl}${questionId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    checkSAnswers(questions: TestPlayerQuestions[]): Observable<any> {
        let body = this.createBodyCheck(questions);
        return this.http
            .post(this.checkSAnswerUrl, JSON.stringify(body), {headers: this.headersCheckSAnswer})
            .map(this.successResponse)
            .catch(this.handleError);
    }

    createButtons(countOfButtons: number): TestPlayerNavButton[] {
        let navButtons: TestPlayerNavButton[] = [
            {answered: false, label: "01", active: true, className: `${navButtonConstClassName} btn-warning`}];
        for (let i = 1; i < countOfButtons; i++) {
            navButtons.push(new TestPlayerNavButton());
            navButtons[i].label = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
            navButtons[i].className = `${navButtonConstClassName} btn-primary`;
        }
        return navButtons;
    }

    getUserRate(results: TestPlayerDtapiResult[], questions: TestPlayerQuestions[]): number {
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

    createBodyCheck(questions: TestPlayerQuestions[]) {
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