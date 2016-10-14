export class Faculty {
    faculty_id?: number;
    faculty_name?: string;
    faculty_description?: string;

    constructor(faculty_name: string, faculty_description: string) {
        this.faculty_name = faculty_name;
        this.faculty_description = faculty_description;
    }
}