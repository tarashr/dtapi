export class Group {
    group_id?: number;
    group_name: string;
    faculty_id?: number;
    faculty_name?: string;
    speciality_id?: number;
    speciality_name?: string;

    constructor(group_name: string, faculty_id?: number, speciality_id?: number) {
        this.group_name = group_name;
        this.faculty_id = faculty_id;
        this.speciality_id = speciality_id;
    }
}