import {Injectable}      from "@angular/core";
import {ConfigModalInfo} from "../classes/configs/config-modal-info";
import {InfoModalComponent} from "../components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
const md5 = require("crypto-js/md5");

@Injectable()
export class CommonService {

    constructor(private modalService: NgbModal) {
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

    cryptData(data: any): string {
        return md5(JSON.stringify(data)).toString();
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

    openModalInfo(...arr: string[]): Promise <any> {
        let config: ConfigModalInfo = new ConfigModalInfo(arr[0], arr[1], arr[2]);
        let modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRef.componentInstance.config = config;
        return modalRef.result;
    }
}

