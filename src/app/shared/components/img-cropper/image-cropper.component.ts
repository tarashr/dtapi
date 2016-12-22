import {Component, ViewChild, ElementRef} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {successEventModal, modalInfoConfig} from "../../../shared/constant";
import {ImageCropperComponent, CropperSettings} from "ng2-img-cropper";

@Component({
    selector: "image-cropper",
    templateUrl: "image-cropper.component.html",
    styleUrls: ["image-cropper.component.scss"]
})
export class ModalImageCropperComponent {

    public maxFileSize: number = 3000000;
    public modalInfoConfig: any = modalInfoConfig;
    public successEventModal: any = successEventModal;

    data: any;
    cropperSettings: CropperSettings;

    @ViewChild("cropper", undefined) cropper: ImageCropperComponent;
    @ViewChild("croppedPhoto") croppedPhoto: ElementRef;

    constructor(private activeModal: NgbActiveModal,
                private modalService: NgbModal) {

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.croppedWidth = 200;
        this.cropperSettings.croppedHeight = 200;
        this.cropperSettings.width = 1;
        this.cropperSettings.height = 1;
        this.data = {};
    }

    fileChangeListener($event) {
        let image: any = new Image();
        let file: File = $event.target.files[0];
        if (file.size > this.maxFileSize) {
            this.modalInfoConfig.infoString = `Розмір фотографії повинен бути не більше ${this.maxFileSize / 1000000} Мб`;
            this.successEventModal();
            return;
        }
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
        };
        myReader.readAsDataURL(file);
    }

    savePhoto(data: any) {
        this.activeModal.close(data.nativeElement.src);
    }
}