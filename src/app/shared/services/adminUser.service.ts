import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import '../rxjs-operators';

import {User}   from '../classes/user'
import *as url from '../constants_url';

@Injectable()
export class AdminUserService {

    private headers = new Headers({'Content-Type':'application/json'});

    constructor(private http: Http){}

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    public getAdminUsers(): Observable<User[]> {
        return this.http
            .get(url.getAdminUsersUrl)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    public deleteAdminUser(id: number): Observable<any> {
        return this.http.delete(`${url.delAdminUserUrl}/${id}`, {headers: this.headers})
            .catch(this.handleError)
    }

    public updateAdminUser(adminUser, user_id): Observable<any> {
        return this.http.post(`${url.editAdminUserUrl}/${user_id}`, JSON.stringify(adminUser), {headers: this.headers})
            .map((res: Response) => res.json())
            .catch(this.handleError)
    }

    public createAdminUser(adminUser): Observable<User[]> {
        return this.http.post(`${url.addAdminUserUrl}`, JSON.stringify(adminUser), {headers: this.headers})
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }
}