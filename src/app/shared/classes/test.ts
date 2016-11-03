export class Test {
    test_id?: number;
    test_name?: string;
    subject_id?: number;
    tasks?: any;
    time_for_test: any;
    enabled: boolean;
    attempts: number;

    constructor(test_name: string,
                subject_id: number,
                tasks: any,
                time_for_test: any,
                attempts: number)
    {
        this.test_name = test_name;
        this.subject_id = subject_id;
        this.tasks = tasks;
        this.time_for_test = time_for_test;
        this.attempts = attempts;
    }
}
