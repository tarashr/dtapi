export class Question {
    question_id?: number;
    test_id?: number;
    question_text?: string;
    level?: number;
    type: any;
    attachment: any;

    constructor(question_text: string,
                level: number,
                type: number,
                attachment: number,
                test_id?: number) {
        this.question_text = question_text;
        this.level = level;
        this.type = type;
        this.attachment = attachment;
        this.test_id = test_id;
    }
}
