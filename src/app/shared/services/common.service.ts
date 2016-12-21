import {Injectable}      from "@angular/core";
import {ConfigModalInfo} from "../classes/configs/config-modal-info";
import {InfoModalComponent} from "../components/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalAddEditComponent} from "../components/addeditmodal/modal-add-edit.component";
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

    formatTime(date: Date, format: string) {
        const createPartsOFTime = {
            YYYY: (date): string => {
                return this.leftPad(date.getFullYear());
            },
            MM: (date): string => {
                return this.leftPad(date.getMonth() + 1);
            },
            DD: (date): string => {
                return this.leftPad(date.getDate());
            },
            hh: (date): string => {
                return this.leftPad(date.getHours());
            },
            mm: (date): string => {
                return this.leftPad(date.getMinutes());
            },
            ss: (date): string => {
                return this.leftPad(date.getSeconds());
            }
        };
        const timeElements: string[] = format.split(/-|:|,|\.| /);
        for (let i = 0; i < timeElements.length; i++) {
            if (timeElements[i] === "") {
                timeElements.splice(i, 1);
                i--;
            }
        }
        const rightFormat: boolean = timeElements.every(elem => {
            return !!createPartsOFTime[elem];
        });
        if (!rightFormat) {
            return "wrong format";
        }
        const separators: string[] = [];
        for (let i = 0; i < timeElements.length - 1; i++) {
            let start = format.indexOf(timeElements[i]) + timeElements[i].length;
            let end = format.indexOf(timeElements[i + 1]);
            separators.push(format.slice(start, end));
        }
        let result: string = "";
        timeElements.forEach((elem, i) => {
            result += separators[i] ? createPartsOFTime[elem](date) + separators[i] : createPartsOFTime[elem](date);
        });

        return result;
    }

    openModalInfo(...arr: string[]): Promise <any> {
        let config: ConfigModalInfo = new ConfigModalInfo(arr[0], arr[1], arr[2]);
        let modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
        modalRef.componentInstance.config = config;
        return modalRef.result;
    }

    openModalAddEdit(configAddEdit: Object): Promise <any> {
        const modalRefEdit = this.modalService.open(ModalAddEditComponent);
        modalRefEdit.componentInstance.config = configAddEdit;
        return modalRefEdit.result;
    }


}

