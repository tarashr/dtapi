import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Router} from "@angular/router";
import {baseUrl}         from "../constant";
import {CRUDService} from "../services/crud.service";
import {Student} from "../classes/student";
import {EntityManagerBody} from "../classes/entity-manager-body";
import {Observable} from 'rxjs';
import '../rxjs-operators';

@Injectable()
export class StudentService {

    private hostUrlBase:string = baseUrl;
    private crudService: CRUDService;
    private successResponse = (response:Response)=>response.json();
    public groupId: number[] = [];

    constructor(private _http:Http,
                private router:Router) {
    };

    private handleError = (error:any)=> {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        if (error.status == "403") {
            sessionStorage.removeItem("userRole");
            this.router.navigate(['/login'])
        }
        return Observable.throw(errMsg);
    };


    /*getRecordsRange(entity:string, limit:number, offset:number):Observable<any> {
        return this._http
            .get(`${this.hostUrlBase}${entity}/getRecordsRange/${limit}/${offset}`)
            .map(this.successResponse)
            .catch(this.handleError);
    }*/

    /*getCountRecords () {
    this.crudService.getCountRecords(this.entity)
        .subscribe(
            data => {
                this.entityDataLength = +data.numberOfRecords;
                this.getRecordsRange();
            },
            error=>console.log("error: ", error)
        );
};

    getRecordsRange () {
    this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
        .subscribe(
            data => this.entityData = data,
            error=> console.log("error: ", error))
};*/


}