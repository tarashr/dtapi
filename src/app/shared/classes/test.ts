export class Test {
    test_id?: number;
    test_name?: string;
    subject_id?: number;
    tasks?: any;
    time_for_test: any;
    enabled: number;
    attempts: number;

    constructor(test_name: string,
                tasks: any,
                time_for_test: any,
                enabled: number,
                attempts: number,
                subject_id: number)
    {
        this.test_name = test_name;
        this.tasks = tasks;
        this.time_for_test = time_for_test;
        this.attempts = attempts;
        this.enabled = enabled;
        this.subject_id = subject_id;
    }
}
