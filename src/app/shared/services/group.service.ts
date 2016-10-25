import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';
import '../rxjs-operators';
import 'rxjs/add/operator/mergeMap';

import {Group}   from '../classes/group'
import *as url from '../constants';
import {Faculty} from "../classes/faculty";
import {Speciality} from "../classes/speciality";
import {Student} from "../classes/student";

@Injectable()
export class GroupService {
    constructor(private http: Http) {
    }

    private headers = new Headers({'Content-Type': 'application/json'});

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }


    getCountRecords(): Observable<any> {
        return this.http
            .get(url.countGroupsUrl)
            .map((res: Response)=>res.json())
            .do((response) => {
                console.log(JSON.stringify(response));
            })
            .catch(this.handleError);
    }


    getRecordsRange(limit: number, offset: number): Observable<any> {
        return this.http
            .get(`${url.getRangeOfGroupUrl}/${limit}/${offset}`)
            .map((data: Response)=>data.json())
            .catch(this.handleError);
    }

    getFacultys(): Observable<Faculty[]> {
        return this.http
            .get(url.getFacultysUrl)
            .map((res: Response) => res.json())
            .do((response) => console.log(JSON.stringify(response)))
            .catch(this.handleError);
    }

    getSpecialitys(): Observable<Speciality[]> {
        return this.http
            .get(url.getSpecialitysUrl)
            .map((res: Response) => res.json())
            .do((response) => console.log(JSON.stringify(response)))
            .catch(this.handleError);
    }

    getFaculty(facultyId: any): Observable<any> {
        return this.http
            .post(url.getEntityValues, {"entity": "Faculty", "ids": facultyId})
            .map((data: Response)=>data.json())
            // .do((response) => {console.log(JSON.stringify(response));})
            .catch(this.handleError);

    }

    getSpeciality(specialityId: any): Observable<any> {
        return this.http
            .post(url.getEntityValues, {"entity": "Speciality", "ids": specialityId})
            .map((data: Response)=>data.json())
            // .do((response) => {console.log(JSON.stringify(response));})
            .catch(this.handleError);

    }

    createGroup(group): Observable<Group[]> {
        return this.http.post(`${url.addGroupUrl}`, JSON.stringify(group), {headers: this.headers})
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    getGroupsBySearch(criteria): Observable<any> {
        return this.http.get(`${url.getGroupsBySearchUrl}/${criteria}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    deleteGroup(id: number): Observable<any> {
        return this.http.delete(`${url.delGroupUrl}/${id}`, {headers: this.headers})
            .catch(this.handleError);
    }

    getStudents(): Observable<Student[]> {
        return this.http
            .get(url.getStudentsUrl)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    getAllGroup(): Observable<Group[]> {
        return this.http
            .get(url.getGroupUrl)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    updateGroup(groupName, group_id): Observable<any> {
        return this.http.post(`${url.editGroupUrl}/${group_id}`, JSON.stringify(groupName), {headers: this.headers})
            .map((res: Response) => res.json())
            .do((res) => console.log(res))
            .catch(this.handleError);
    }
}