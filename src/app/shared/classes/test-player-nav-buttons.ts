export class TestPlayerNavButton {
    answered: boolean;
    label: string;
    className: string;
    active: boolean;

    constructor(answered: boolean = false, label: string = "", className: string = "", active: boolean = false) {
        this.answered = answered;
        this.label = label;
        this.className = className;
        this.active = active;
    }
}