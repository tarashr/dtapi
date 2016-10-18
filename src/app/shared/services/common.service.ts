import {Injectable} from "@angular/core";
import  {Http, Response} from "@angular/http";
import {Observable}     from 'rxjs';
// import "rxjs";

@Injectable()
export class CommonService {

    private hostUrlBase:string = "http://dtapi.local/";

    constructor(private _http:Http) {
    };

    private handleError(error:any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);

    }

    getRecords(entity:string):Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/getRecords`)
            .map((response:Response)=>response.json())
            .catch(this.handleError);

    }

    getRecordById(entity:string, id:number|string):Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/getRecords/${id}`)
            .map((response:Response)=>response.json())
            .catch(this.handleError);
    }

    getRecordsRange(entity:string, limit:number, offset:number):Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/getRecordsRange/${limit}/${offset}`)
            .map((response:any)=>response.json())
            .catch(this.handleError);
    }

    getCountRecords(entity:string):Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/countRecords`)
            .map((response:any)=>response.json())
            .catch(this.handleError);
    }

    insertData(entity:string, data:any):Observable<any> {
        return this._http
            .post(`${this.hostUrlBase}${entity}/insertData`, JSON.stringify(data))
            .map((response:any)=>response.json())
            .catch(this.handleError);
    }

    updateData(entity:string, id:number, data:any):Observable<any> {
        return this._http
            .post(`${this.hostUrlBase}${entity}/update/${id}`, JSON.stringify(data))
            .map((response:any)=>response.json())
            .catch(this.handleError);
    }

    delRecord(entity:string, id:number|string):Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/del/${id}`)
            .map((response:any)=>response.json())
            .catch(this.handleError);
    }


}
