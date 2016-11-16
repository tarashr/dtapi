import {Injectable} from '@angular/core';
import {Headers, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {CRUDService} from "./crud.service";
import '../rxjs-operators';


@Injectable()
export class StudentPageService {

    constructor(private _commonService:CRUDService) {
    }

    getTimeStamp(mili) {
        mili = +mili * 1000;
        let myDate = new Date(mili);
        let formatDate = myDate.getFullYear() + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) +
            '-' + ('0' + myDate.getDate()).slice(-2);

        return formatDate;
    }


}