export class ConfigModalInfo {
    title: string;
    action: string;
    infoString: string;

    constructor(infoString: string = "", action: string = "info", title: string = "Повідомлення") {
        this.title = title;
        this.action = action;
        this.infoString = infoString;
    }
}