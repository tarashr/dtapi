export class TimeTable {
    timetable_id?: number;
    group_id: number;
    subject_id?: number;
    start_date: any;
    start_time: any;
    end_date: any;
    end_time: any;

    constructor(group_id: number, start_date: any, start_time: any, end_date: any, end_time: any, subject_id?: number) {
        this.group_id = group_id;
        this.subject_id = subject_id;
        this.start_date = start_date;
        this.start_time = start_time;
        this.end_date = end_date;
        this.end_time = end_time;
    }
}