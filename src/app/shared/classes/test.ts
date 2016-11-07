export class Test {
    test_id?: number;
    test_name?: string;
    subject_id?: number;
    tasks?: number;
    time_for_test: number;
    enabled: number;
    attempts: number;

    constructor(test_name: string,
                tasks: number,
                time_for_test: number,
                attempts: number,
                enabled: number,
                subject_id?: number)
    {
        this.test_name = test_name;
        this.tasks = tasks;
        this.time_for_test = time_for_test;
        this.attempts = attempts;
        this.enabled = enabled;
        this.subject_id = subject_id;
    }
}
