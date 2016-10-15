import {Injectable} from "@angular/core";
import  {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";

@Injectable()
export class CommonService {

    private hostUrlBase:string = "http://dtapi.local/";

    constructor(private _http:Http) {
    };

    private handleError(error:any):Promise<any> {
        console.error('An error occurred ', error.status); // for demo purposes only
        return Promise.reject(error.message || error.json());

    }

    getRecords(entity:string):Promise<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/getRecords`)
            .toPromise()
            .then((response:any)=>response.json())
            .catch(this.handleError);

    }

    getRecordById(entity:string, id:number|string):Promise<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/getRecords/${id}`)
            .toPromise()
            .then((response:any)=>response.json())
            .catch(this.handleError);
    }

    getRecordsRange(entity:string, limit:number, offset:number):Promise<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/getRecordsRange/${limit}/${offset}`)
            .toPromise()
            .then((response:any)=>response.json())
            .catch(this.handleError);
    }

    getCountRecords(entity:string):Promise<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/countRecords`)
            .toPromise()
            .then((response:any)=>response.json())
            .catch(this.handleError);
    }

    insertData(entity:string, data:any):Promise<any> {
        return this._http
            .post(`${this.hostUrlBase}${entity}/insertData`, JSON.stringify(data))
            .toPromise()
            .then((response:any)=>response.json())
            .catch(this.handleError);
    }

    updateData(entity:string, id:number, data:any):Promise<any> {
        return this._http
            .post(`${this.hostUrlBase}${entity}/update/${id}`, JSON.stringify(data))
            .toPromise()
            .then((response:any)=>response.json())
            .catch(this.handleError);
    }

    delRecord(entity:string, id:number|string):Promise<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/del/${id}`)
            .toPromise()
            .then((response:any)=>response.json())
            .then(data => {
                if (data.response === "ok") {
                    console.log(`${entity} with id ${id} was delete`)
                }
            })
            .catch(this.handleError);
    }
    
    
}
