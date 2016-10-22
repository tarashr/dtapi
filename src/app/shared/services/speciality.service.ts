import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import '../rxjs-operators';

import {Speciality}   from '../classes/speciality'
import *as url from '../constants_url';

@Injectable()
	export class SpecialityService {

        private headers = new Headers({'Content-Type': 'application/json'});
		constructor( private http:Http){}


		private handleError(error: any) {
		let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
			console.error(errMsg); // log to console instead
			return Observable.throw(errMsg);
    }

    public getSpecialities(): Observable<Speciality[]>{
        return this.http
            .get(url.getSpecialityUrl)
            .map((res: Response) => res.json())
            .do((response) => {console.log(JSON.stringify(response));})
            .catch(this.handleError);
    }

     public deleteSpeciality(id: number): Observable<Speciality[]> {
        return this.http.delete(`${url.delSpecialityUrl}/${id}`, {headers: this.headers})
            .catch(this.handleError);
    }

   }
