export class TimeTable {
    timetable_id?: number;
    group_id: number;
    subject_id?: number;
    start_date: any;
	start_time: any;
	end_date: any;
	end_time: any;

    constructor(group_id: number, start_date: any, subject_id?: number) {
        this.start_date = start_date;
		this.start_time = "00:00:00";
		this.end_date = start_date;
		this.end_time = "23:59:00";
        this.group_id = group_id;
        this.subject_id = subject_id;
    }
}

