import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {successEventModal, modalInfoConfig} from "../../../shared/constant";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {FormGroup, FormControl, Validators} from "@angular/forms";

@Component({
    selector: "modal-add-edit",
    templateUrl: "modal-add-edit.component.html",
    styleUrls: ["modal-add-edit.component.css"]
})
export class ModalAddEditComponent implements OnInit {

    @Input() config: any;
    public maxSizeOfPictures: number = 1000000;
    public modalInfoConfig: any = modalInfoConfig;
    public successEventModal: any = successEventModal;
    public addEditForm: FormGroup;
    public isSamePasswords: boolean = true;

    constructor(private activeModal: NgbActiveModal,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.addEditForm = new FormGroup({
            "username": new FormControl("", [
                Validators.minLength(1)
            ]),
            "groupName": new FormControl("", [
                Validators.pattern("^[А-ЯЁЇІіЄҐ]{2,3}[-][0-9]{2}[-][0-9]{1}$")
            ]),
            "specialityCode": new FormControl("", [
                Validators.pattern("^[0-9. ]*$")
            ]),
            "name": new FormControl("", [
                Validators.pattern("^[A-Za-zА-Яа-яёЁЇїІіЄєҐґ'’,. -]+$")
            ]),
            "count": new FormControl("", [
                Validators.pattern("^[0-9]*$")
            ]),
            "testTime/Rate": new FormControl("", [
                Validators.pattern("^[0-9]*$")
            ]),
            "testAttempts": new FormControl("", [
                Validators.pattern("^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$")
            ]),
            "startDate": new FormControl("", [
                this.dateValidator
            ]),
            "endDate": new FormControl("", [
                this.dateValidator
            ]),
            "startTime": new FormControl("", [
                Validators.pattern("^(([0|1][0-9])|([2][0-3])):([0-5][0-9])$")
            ]),
            "endTime": new FormControl("", [
                Validators.pattern("^(([0|1][0-9])|([2][0-3])):([0-5][0-9])$")
            ]),
            "entityDescription": new FormControl("", [
                Validators.maxLength(100)
            ]),
            "answer": new FormControl("", [
                Validators.maxLength(100)
            ]),
            "email": new FormControl("", [
                Validators.pattern("^[^@]+@[^@]+\.[^@]+$")
            ]),
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
        } else if (control.value.day >= 1 && control.value.day <= 31) {
            if (control.value.month >= 1 && control.value.month <= 12) {
                return null;
            }
            return {Invalid: true};
        } else {
            return {Invalid: true};
        }
    }

    activateForm() {
        if (!this.addEditForm.controls["password"]) {
            this.activeModal.close(this.config);
        } else if (this.addEditForm.controls["password"].value === this.addEditForm.controls["cpassword"].value) {
            this.activeModal.close(this.config);
        } else {
            this.isSamePasswords = false;
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
}