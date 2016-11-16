import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {
    getAnswersByQuestionTestPlayerUrl,
    checkSAnswerUrl,
    navButtonConstClassName,
    getTimeStampUrl,
    saveEndTimeUrl,
    getEndTimeUrl,
    resetSessionDataUrl,
    getTestRecordUrl,
    countTestPassesByStudentUrl
}  from "../constant";
import {TestPlayerNavButton} from "../classes/test-player-nav-buttons";
import {TestPlayerQuestions} from "../classes/test-player-questions";
import {TestPlayerDtapiResult} from "../classes/test-player-dtapi-result";

@Injectable()
export class TestPlayerService {

    private getAnswersByQuestionUrl: string = getAnswersByQuestionTestPlayerUrl;
    private checkSAnswerUrl: string = checkSAnswerUrl;
    private getTimeStampUrl: string = getTimeStampUrl;
    private saveEndTimeUrl: string = saveEndTimeUrl;
    private getEndTimeUrl: string = getEndTimeUrl;
    private getTestRecordUrl: string = getTestRecordUrl;
    private resetSessionDataUrl: string = resetSessionDataUrl;
    private countTestPassesByStudentUrl: string = countTestPassesByStudentUrl;
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

    getTestRecord(testId: number) {
        return this.http
            .get(`${this.getTestRecordUrl}${testId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getTimeStamp(): Observable<any> {
        return this.http
            .get(`${this.getTimeStampUrl}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    saveEndTime(body: any) {
        this.http
            .post(this.saveEndTimeUrl, JSON.stringify(body), {headers: this.headersCheckSAnswer})
            .map(this.successResponse)
            .catch(this.handleError)
            .subscribe();
    }

    getEndTime(): Observable<any> {
        return this.http
            .get(`${this.getEndTimeUrl}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    resetSessionData() {
        this.http
            .get(`${this.resetSessionDataUrl}`)
            .map(this.successResponse)
            .catch(this.handleError)
            .subscribe();
    }


    countTestPassesByStudent(studentId: string | number, testId: string | number): Observable<any> {
        return this.http
            .get(`${this.countTestPassesByStudentUrl}/${studentId}/${testId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    createButtons(countOfButtons: number): TestPlayerNavButton[] {
        let navButtons: TestPlayerNavButton[] = [
            {answered: false, label: "01", active: true, className: `${navButtonConstClassName} btn-warning`}];
        for (let i = 1; i < countOfButtons; i++) {
            navButtons.push(new TestPlayerNavButton());
            navButtons[i].label = this.leftPad(i + 1);
            navButtons[i].className = `${navButtonConstClassName} btn-primary`;
        }
        return navButtons;
    }

    getUserRate(results: TestPlayerDtapiResult[], questions: TestPlayerQuestions[]): number {
        let userRate: number = 0;
        results.forEach((result) => {
            if (!result.true) return;
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

    createBodyResult(studentId: number|string,
                     testId: number|string,
                     startTime: number,
                     endTime: number,
                     userRate: number,
                     results: any[],
                     questions: TestPlayerQuestions[]): any {
        let bodyResult: any = {};
        bodyResult.true_answers = "";
        bodyResult.answers = "";
        bodyResult.student_id = studentId;
        bodyResult.test_id = testId;
        let date = new Date(startTime * 1000);
        let dateEnd = new Date(endTime * 1000);
        bodyResult.session_date = `${this.leftPad(date.getFullYear())}-${this.leftPad(date.getMonth() + 1)}-${this.leftPad(date.getDate())}`;
        bodyResult.start_time = `${this.leftPad(date.getHours())}:${this.leftPad(date.getMinutes())}:${this.leftPad(date.getSeconds())}`;
        bodyResult.end_time = `${this.leftPad(dateEnd.getHours())}:${this.leftPad(dateEnd.getMinutes())}:${this.leftPad(dateEnd.getSeconds())}`;
        bodyResult.result = userRate;
        bodyResult.questions = [];
        if (!results.length) {
            bodyResult.questions = questions.map(item => {
                return {question_id: item.question_id};
            });
        } else {
            bodyResult.questions = questions.map((item) => {
                let question: any = {};
                question.question_id = item.question_id;
                question.answers = [];
                for (let key in item.chosenAnswer) {
                    if (item.chosenAnswer[key]) {
                        question.answers.push(key);
                    }
                }
                results.forEach(result => {
                    if (result.question_id === item.question_id) {
                        question.true = result.true;
                    }
                });
                return question;
            });
        }
        bodyResult.questions = JSON.stringify(bodyResult.questions);
        return bodyResult;
    }

    leftPad(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
    }
}