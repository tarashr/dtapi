export class Speciality {
    speciality_id?: number;
    speciality_name?: string;
    speciality_code?: string;

    constructor(speciality_name: string, speciality_code: string) {
        this.speciality_name = speciality_name;
        this.speciality_code = speciality_code;
    }
}