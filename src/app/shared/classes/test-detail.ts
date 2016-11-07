
export class TestDetail {
    id?: number;
    test_id?: number;
    level: number;
    tasks?: number;
    rate: number;

    constructor(level: number,
                tasks: number,
                rate: number,
                test_id?: number)
    {
        this.level = level;
        this.tasks = tasks;
        this.rate = rate;
        this.test_id = test_id;
    }
}
