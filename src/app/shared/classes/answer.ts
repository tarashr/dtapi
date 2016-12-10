export class Answer {
    answer_id?: number;
    question_id?: number;
    true_answer: number;
    answer_text: string;
    attachment: any;

    constructor(attachment: any,
                answer_text: string,
                true_answer: number,
                question_id?: number,) {
        this.question_id = question_id;
        this.true_answer = true_answer;
        this.answer_text = answer_text;
        this.attachment = attachment;
    }
}

