import {Injectable}      from "@angular/core";
import {Router} from "@angular/router";
import {Http, Response}  from "@angular/http";
import {Observable}      from "rxjs/Observable";
import {baseUrl}         from "../constants.ts";
import {EntityManagerBody} from "../classes/entity-manager-body";

@Injectable()
export class CRUDService {

    private hostUrlBase: string = baseUrl;

    constructor(private _http: Http,
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

    getRecords(entity: string): Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/getRecords`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getRecordById(entity: string, id: number|string): Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/getRecords/${id}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getRecordsRange(entity: string, limit: number, offset: number): Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/getRecordsRange/${limit}/${offset}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getCountRecords(entity: string): Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/countRecords`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    insertData(entity: string, data: any): Observable<any> {
        return this._http
            .post(`${this.hostUrlBase}${entity}/insertData`, JSON.stringify(data))
            .map(this.successResponse)
            .catch(this.handleError);
    }

    updateData(entity: string, id: number, data: any): Observable<any> {
        return this._http
            .post(`${this.hostUrlBase}${entity}/update/${id}`, JSON.stringify(data))
            .map(this.successResponse)
            .catch(this.handleError);
    }

    delRecord(entity: string, id: number|string): Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/del/${id}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getEntityValues(data: EntityManagerBody): Observable<any> {
        return this._http
            .post(`${this.hostUrlBase}EntityManager/getEntityValues`, JSON.stringify(data))
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getGroupsByFaculty(faculty_id: number): Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}group/getGroupsByFaculty/${faculty_id}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getRecordsBySearch(entity: string, search: string) {
        return this._http
            .get(`${this.hostUrlBase}${entity}/getRecordsBySearch/${search}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getTimeTableForGroup(groupId: number|string): Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}timeTable/getTimeTablesForGroup/${groupId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getTestsBySubject(groupId: number|string): Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}timeTable/getTimeTablesForGroup/${groupId}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

    getTime(): Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}TestPlayer/getTimeStamp`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

     getGroupsBySpeciality(faculty_id: number): Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}group/getGroupsBySpeciality/${faculty_id}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }
    getStudentsByGroup(group_id: number): Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}/student/getStudentsByGroup/${group_id}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }

   
}

