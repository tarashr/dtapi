export class Speciality {
    speciality_id: number;
    speciality_code: number;
    speciality_name: string;

    constructor (speciality_code: number, speciality_name: string ) {
        this.speciality_code = speciality_code;
        this.speciality_name = speciality_name;
    }
}