import {Observable} from "rxjs";

export const mockRouter = {
    navigate: jasmine.createSpy('navigate')
};

export const mockCRUDService = {
    insertData(){
        return Observable.of("");
    },
    getRecordById(string, number){
        Observable.of("");
    }
};

export const mockCommonService = {
    openModalInfo(...arr){
        return new Promise((resolve, reject) => {
        });
    },
    leftPad(number){
        return "05555";
    },
    formatTime(date, format){
        return "2016-12-32";
    },
    cryptData(data){
        return "md5hash";
    }
};

export const mockSubjectService = {
    getTestDetailsByTest(id: number): any{
        if (id === 3) {
            return Observable.of(mockTestDetails);
        } else {
            return Observable.of({response: "no records"});
        }
    },
    getQuestionsByLevelRand(a, b, c){
        return Observable.of("testDetails");
    }
};

export const mockTestDetails = [
    {
        "id": "1",
        "test_id": "3",
        "level": "1",
        "tasks": "2",
        "rate": "1"
    },
    {
        "id": "2",
        "test_id": "3",
        "level": "2",
        "tasks": "1",
        "rate": "1"
    },
    {
        "id": "3",
        "test_id": "3",
        "level": "3",
        "tasks": "1",
        "rate": "2"
    },
    {
        "id": "4",
        "test_id": "3",
        "level": "4",
        "tasks": "1",
        "rate": "3"
    },
    {
        "id": "5",
        "test_id": "3",
        "level": "5",
        "tasks": "1",
        "rate": "5"
    }
];

export const mockAnswersResponse = [
    {
        answer_id: 1,
        answer_text: 4,
        attachment: "",
        question_id: 1
    },
    {
        answer_id: 2,
        answer_text: 6,
        attachment: "",
        question_id: 1
    }];
export const mockCheckSanswersResponse = [
    {true: 0, question_id: 1},
    {true: 1, question_id: 2},
    {true: 1, question_id: 3}];
export const mockPrepareQuestions = [
    [
        {
            "question_id": "4",
            "test_id": "3",
            "question_text": "3 + 3",
            "level": "1",
            "type": "1",
            "attachment": ""
        },
        {
            "question_id": "3",
            "test_id": "3",
            "question_text": "2 + 2",
            "level": "1",
            "type": "1",
            "attachment": ""
        }
    ],
    [
        {
            "question_id": "6",
            "test_id": "3",
            "question_text": "6 * 3",
            "level": "2",
            "type": "1",
            "attachment": ""
        }
    ]
];
export const mockPrepareTestDetails = [
    {
        "id": "1",
        "test_id": "3",
        "level": "1",
        "tasks": "2",
        "rate": "1"
    },
    {
        "id": "2",
        "test_id": "3",
        "level": "2",
        "tasks": "1",
        "rate": "1"
    }
];
export const mockPrepareResultQuestions = [
    {
        "question_id": "4",
        "test_id": "3",
        "question_text": "3 + 3",
        "level": "1",
        "type": "radio",
        "attachment": "",
        "chosenAnswer": {},
        "rate": "1",
        "answered": false,
        "active": true
    },
    {
        "question_id": "3",
        "test_id": "3",
        "question_text": "2 + 2",
        "level": "1",
        "type": "radio",
        "attachment": "",
        "chosenAnswer": {},
        "rate": "1",
        "answered": false,
        "active": false
    },
    {
        "question_id": "6",
        "test_id": "3",
        "question_text": "6 * 3",
        "level": "2",
        "type": "radio",
        "attachment": "",
        "chosenAnswer": {},
        "rate": "1",
        "answered": false,
        "active": false
    }
];
