import {Component, ViewChild, Input, OnInit, Output, ElementRef, EventEmitter} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {successEventModal, modalInfoConfig} from "../../../shared/constant";
import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';

@Component({
    selector: "image-cropper",
    templateUrl: "image-cropper.component.html",
    styleUrls: ["image-cropper.component.scss"]
})
export class ModalImageCropperComponent implements OnInit {

    @Output() croppedPhotoOut = new EventEmitter();
    public maxFileSize: number = 3000000;
    public modalInfoConfig: any = modalInfoConfig;
    public successEventModal: any = successEventModal;

    data:any;  // cropper data
    cropperSettings: CropperSettings; // cropper data

    @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
    @ViewChild('croppedPhoto') croppedPhoto:ElementRef;

    constructor(private activeModal: NgbActiveModal,
                private modalService: NgbModal) {

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.croppedWidth = 200;
        this.cropperSettings.croppedHeight = 200;
        this.data = {};
    }

    ngOnInit() {
}

    fileChangeListener($event) {
        let image:any = new Image();
        let file:File = $event.target.files[0];
        if (file.size > this.maxFileSize) {
            this.modalInfoConfig.infoString = `Розмір фотографії повинен бути не більше ${this.maxFileSize / 1000000} Мб`;
            this.successEventModal();
            return;
        }
        let myReader:FileReader = new FileReader();
        let that = this;
        myReader.onloadend = function (loadEvent:any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
        };
        myReader.readAsDataURL(file);
    }

    savePhoto(data:any){
        this.croppedPhotoOut = data.nativeElement.src;
        this.activeModal.close();
    }
}