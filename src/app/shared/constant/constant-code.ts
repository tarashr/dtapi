import {InfoModalComponent} from "../components/info-modal/info-modal.component";
const badDownloadDataMessage: string = "Виникла помилка в процесі завантаження даних. Зверніться до адміністратора";
const badDeleteDataMessage: string = "Виникла помилка в процесі видалення. Спробуйте здійснити видалення повторно!";

export const changeLimit = function (limit: number): void {
    this.limit = limit;
    this.offset = 0;
    this.page = 1;
    this.getRecordsRange();
};

export const pageChange = function (num: number) {
    if (!num) {
        this.page = 1;
        return;
    }
    this.page = num;
    this.offset = (this.page - 1) * this.limit;
    this.getRecordsRange();
};

export const getCountRecords = function () {
    this.crudService.getCountRecords(this.entity)
        .subscribe(
            data => {
                this.entityDataLength = +data.numberOfRecords;
                this.getRecordsRange();
            },
            () => {
                this.commonService.openModalInfo(badDownloadDataMessage);
            }
        );
};

export const getRecordsRange = function () {
    this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
        .subscribe(
            data => {
                this.createTableConfig(data);
                if (this.loader) {
                    this.loader = false;
                }
            },
            () => {
                this.commonService.openModalInfo(badDownloadDataMessage);
            })
};

export const successEventModal = function () {
    this.modalInfoConfig.action = "info";
    this.modalInfoConfig.title = "Повідомлення";
    const modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
    modalRef.componentInstance.config = this.modalInfoConfig;
};

export const delRecord = function (entity: string, id: number) {
    this.offset = (this.page - 1) * this.limit;
    this.crudService.delRecord(entity, id)
        .subscribe(() => {
                this.commonService.openModalInfo(`Видалення пройшло успішно.`);
                this.refreshData("delete");
            },
            () => {
                this.commonService.openModalInfo(badDeleteDataMessage);
            });
};

export const findEntity = function (searchTerm: string) {
    if (this.loader === false) {
        this.loader = true;
    }
    this.search = searchTerm;
    if (this.search.length === 0) {
        this.offset = 0;
        this.page = 1;
        this.getCountRecords();
        return;
    }
    this.crudService.getRecordsBySearch(this.entity, this.search)
        .subscribe(data => {
            if (this.loader) {
                this.loader = false;
            }
            if (data.response === "no records") {
                this.entityData = [];
                return;
            }
            this.page = 1;
            this.createTableConfig(data);
        }, () => {
            this.commonService.openModalInfo(badDownloadDataMessage);
        });
};

export const refreshData = function (action: string) {
    if (action === "delete" && this.entityData.length === 1 && this.entityDataLength > 1) {
        this.offset = (this.page - 2) * this.limit;
        this.page -= 1;
    } else if (this.entityData.length > 1) {
        this.offset = (this.page - 1) * this.limit;
    }

    this.getCountRecords();
};