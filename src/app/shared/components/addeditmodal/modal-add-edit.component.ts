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
        console.log(this.config.list[0]);
        this.addEditForm = new FormGroup({
            "username": new FormControl("", Validators.required),
            "email": new FormControl("", [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            "password": new FormControl("", [
                Validators.required,
                Validators.pattern("^[a-zA-Z0-9_-]{8,}$")
            ]),
            "cpassword": new FormControl("", [
                Validators.required,
                Validators.pattern("^[a-zA-Z0-9_-]{8,}$")
            ]),
        });
    }

    comparePasswords(password: string, cpassword: string) {
        if (this.addEditForm.controls["password"].value === this.addEditForm.controls["cpassword"].value) {
            this.isSamePasswords = true;
        } else {
            this.isSamePasswords = false;
        }
    }

    onSubmit() {
        console.log(this.addEditForm);
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