import {Injectable}      from "@angular/core";
import {Router} from "@angular/router";
import {Http, Response}  from "@angular/http";
import {Observable}      from "rxjs/Observable";
import {baseUrl}         from "../constants.ts";
import {EntityManagerBody} from "../classes/entity-manager-body";

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

    getTimeTablesForGroup(group_id: number): Observable<any> {
        return this.http
            .get(`${this.hostUrlBase}group/getTimeTablesForGroup/${group_id}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }
}