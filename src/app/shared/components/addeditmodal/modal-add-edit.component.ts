import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {successEventModal, modalInfoConfig} from "../../../shared/constant";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {patterns} from "../../../shared/constant";
import {ModalImageCropperComponent} from "../img-cropper/image-cropper.component";

const CryptoJS = require("crypto-js/hmac-sha256");

@Component({
    selector: "modal-add-edit",
    templateUrl: "modal-add-edit.component.html",
    styleUrls: ["modal-add-edit.component.scss"]
})
export class ModalAddEditComponent implements OnInit {

    @Input() config: any;
    public maxSizeOfPictures: number = 1000000;
    public modalInfoConfig: any = modalInfoConfig;
    public successEventModal: any = successEventModal;
    public addEditForm: FormGroup;
    public isSamePasswords: boolean = true;
    public isTruePassword: boolean = true;
    public isValidDatesTimes: boolean = true;

    constructor(private activeModal: NgbActiveModal,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.addEditForm = new FormGroup({
            "username": new FormControl("", [
                Validators.minLength(1)
            ]),
            "groupName": new FormControl("", [
                Validators.pattern(patterns.groupName)
            ]),
            "specialityCode": new FormControl("", [
                Validators.pattern(patterns.code)
            ]),
            "name": new FormControl("", [
                Validators.pattern(patterns.entityName),
            ]),
            "count": new FormControl("", [
                Validators.pattern(patterns.number)
            ]),
            "answerCount": new FormControl("", [
                Validators.pattern(patterns.answerCount)
            ]),
            "testTime/Rate": new FormControl("", [
                Validators.pattern(patterns.number)
            ]),
            "testAttempts": new FormControl("", [
                Validators.pattern(patterns.numberUpTo255)
            ]),
            "startDate": new FormControl("", [
                this.dateValidator
            ]),
            "endDate": new FormControl("", [
                this.dateValidator
            ]),
            "startTime": new FormControl("", [
                Validators.pattern(patterns.time)
            ]),
            "endTime": new FormControl("", [
                Validators.pattern(patterns.time)
            ]),
            "entityDescription": new FormControl("", [
                Validators.maxLength(100)
            ]),
            "answer": new FormControl("", [
                Validators.maxLength(100)
            ]),
            "email": new FormControl("", [
                Validators.pattern(patterns.email)
            ]),
            "oldPassword": new FormControl(""),
            "password": new FormControl("", [
                Validators.minLength(8)
            ]),
            "cpassword": new FormControl("", [
                Validators.minLength(8)
            ]),
        });
    }

    dateValidator(control: FormControl): {[key: string]: boolean} {
        if (control.value === null) {
            return {Invalid: true};
        } else if (control.value === "") {
            return null;
        } else {
            const newDate = new Date(control.value.year, (control.value.month - 1), control.value.day);
            const isValid = (newDate.getFullYear() === control.value.year) &&
                (newDate.getMonth() === (control.value.month - 1)) &&
                (newDate.getDate() === control.value.day);
            return isValid ? null : {Invalid: true};
        }
    }

    compareDates(startDate, endDate): number {
        const newStartDate = new Date(startDate.year, startDate.month - 1 , startDate.day);
        const dateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        if (newStartDate < dateNow) {
            return 0;
        } else {
            const newEndDate = new Date(endDate.year, endDate.month - 1, endDate.day);
            return (newStartDate < newEndDate) ? 1 : (newStartDate > newEndDate) ? 0 : 2;
        }
    }

    compareTimes(startTime: string, endTime: string): boolean {
        const startTimeArr = startTime.split(":");
        const endTimeArr = endTime.split(":");
        const dateNow = new Date();
        const hoursNow = dateNow.getHours();
        const minutesNow = dateNow.getMinutes();
        if (+startTimeArr[0] < hoursNow) {
            return false;
        } else if (+startTimeArr[0] === hoursNow) {
            if ((+startTimeArr[1] >= minutesNow) && (+startTimeArr[0] <= +endTimeArr[0])) {
                return (+startTimeArr[0] < +endTimeArr[0]) ? true : (+startTimeArr[1] < +endTimeArr[1]);
            }
            return false;
        } else {
            if (+startTimeArr[0] <= +endTimeArr[0]) {
                return (+startTimeArr[0] < +endTimeArr[0]) ? true : (+startTimeArr[1] < +endTimeArr[1]);
            }
            return false;
        }
    }

    activateForm() {
        if (this.addEditForm.controls["oldPassword"].value) {
            this.isTruePassword = true;
            this.isSamePasswords = true;
            if (CryptoJS(this.addEditForm.controls["oldPassword"].value, "tuhes").toString() === this.config.oldPassword) {
                if (this.addEditForm.controls["password"].value === this.addEditForm.controls["cpassword"].value) {
                    this.activeModal.close(this.config);
                } else {
                    this.isSamePasswords = false;
                }
            } else {
                this.isTruePassword = false;
            }
        } else if (this.addEditForm.controls["password"].value) {
            if (this.addEditForm.controls["password"].value === this.addEditForm.controls["cpassword"].value) {
                this.activeModal.close(this.config);
            } else {
                this.isSamePasswords = false;
            }
        } else if (this.addEditForm.controls["startDate"].value) {
            const compareStatus = this.compareDates(this.addEditForm.controls["startDate"].value,
                this.addEditForm.controls["endDate"].value);
            if (compareStatus === 1) {
                this.activeModal.close(this.config);
            } else if (compareStatus === 2 && this.compareTimes(this.addEditForm.controls["startTime"].value,
                    this.addEditForm.controls["endTime"].value)) {
                this.activeModal.close(this.config);
            } else {
                this.isValidDatesTimes = false;
            }
        } else {
            this.activeModal.close(this.config);
        }
    }

    openFile($event) {
        let input = $event.target;
        if (input.files[0].size > this.maxSizeOfPictures) {
            this.modalInfoConfig.infoString = "Перевищено максимальний розміо зображення";
            this.successEventModal();
        }
        let reader = new FileReader();
        reader.onload = () => {
            let dataURL = reader.result;
            this.config.img.value = dataURL;
        };
        reader.readAsDataURL(input.files[0]);
    }

    removeImage() {
        this.config.img.value = "";
    }

    // for datepicker
    isWeekend(date: NgbDateStruct) {
        const d = new Date(date.year, date.month - 1, date.day);
        return d.getDay() === 0 || d.getDay() === 6;
    }

    isDisabled(date: NgbDateStruct, current: {month: number}) {
        return date.month !== current.month;
    }
    // the end of datapicker's code

    modalOpen(){
        let modalRef = this.modalService.open(ModalImageCropperComponent);
        modalRef.result
            .then((data: any) => {
                this.config.img.value = data;
            }, () => {
                return;
            });
    }
}