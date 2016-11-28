import {InfoModalComponent} from "../components/info-modal/info-modal.component";

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
            error => console.log("error: ", error)
        );
};

export const getRecordsRange = function() {
    this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
        .subscribe(
            data => {
                this.createTableConfig(data);
            },
            error => console.log("error: ", error));
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
            this.modalInfoConfig.infoString = `Видалення пройшло успішно.`;
            this.modalInfoConfig.action = "info";
            this.modalInfoConfig.title = "Повідомлення";
            const modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
            modalRef.componentInstance.config = this.modalInfoConfig;
            this.refreshData("delete");
        });
};

export const findEntity = function(searchTerm: string) {
    this.search = searchTerm;
    if (this.search.length === 0) {
        this.offset = 0;
        this.page = 1;
        this.getCountRecords();
        return;
    }
    this.crudService.getRecordsBySearch(this.entity, this.search)
        .subscribe(data => {
            if (data.response === "no records") {
                this.entityData = [];
                return;
            }
            this.page = 1;
            this.createTableConfig(data);
        }, error => console.log("error: ", error));
};

export const refreshData = function (action: string) {
    if (action === "delete" && this.entityData.length === 1 && this.entityDataLength > 1) {
        this.offset = (this.page - 2) * this.limit;
        this.page -= 1;
    } else if (this.entityData.length > 1) {
        this.offset = (this.page - 1) * this.limit;
    }

    this.crudService.getCountRecords(this.entity)
        .subscribe(
            data => {
                this.entityDataLength = +data.numberOfRecords;
                this.getRecordsRange();
            },
            error => console.log(error)
        );
};