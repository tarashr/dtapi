import {Injectable}      from "@angular/core";
const md5 = require("crypto-js/md5");

@Injectable()
export class CommonService {

    constructor() {
    };

    leftPad(num: number): string {
        let result: string;
        if (num >= 0) {
            result = num < 10 ? `0${num}` : `${num}`;
        } else {
            result = Math.abs(num) < 10 ? `-0${Math.abs(num)}` : `${num}`;
        }
        return result;
    }

    cryptData(data: any) {
        return md5(data).toString();
    }

    createSQLDate(date: Date, type: string, separator: string): string {
        let result: string;
        if (type === "date") {
            const year: string = this.leftPad(date.getFullYear());
            const month: string = this.leftPad(date.getMonth() + 1);
            const day: string = this.leftPad(date.getDate());
            result = [year, month, day].join(separator);
        } else if (type === "time") {
            const hours: string = this.leftPad(date.getHours());
            const min: string = this.leftPad(date.getMinutes());
            const sec: string = this.leftPad(date.getSeconds());
            result = [hours, min, sec].join(separator);
        }
        return result;
    }
}

