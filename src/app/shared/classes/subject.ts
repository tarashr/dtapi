export class Subject {
    subject_id?: number;
    subject_name?: string;
    subject_description?: string;
    constructor (subject_name: string, subject_description: string ) {
        this.subject_name = subject_name;
        this.subject_description = subject_description;
    }
}

