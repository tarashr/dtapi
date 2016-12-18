import {async, getTestBed, TestBed, inject} from "@angular/core/testing";
import {BaseRequestOptions, Http, Response, ResponseOptions, XHRBackend, HttpModule, Headers} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {TestPlayerService} from "./test-player.service";
import {navButtonConstClassName, modalInfoParams}  from "../constant";
import {
    TestPlayerNavButton,
    TestPlayerQuestions,
    TestPlayerDtapiResult,
    TestDetail,
    TestPlayerAnswers
} from "../classes";
import {SubjectService} from "./subject.service";
import {CRUDService} from "./crud.service";
import {CommonService} from "./common.service";
import {Observable} from "rxjs";
import {Router, Routes} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {AppComponent} from "../../app.component";

let mockTestDetails = [
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
let mockAnswersResponse = [
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
let mockCheckSanswersResponse = [
    {true: 0, question_id: 1},
    {true: 1, question_id: 2},
    {true: 1, question_id: 3}];
let mockPrepareQuestions = [
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
let mockPrepareTestDetails = [
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
let mockPrepareResultQuestions = [
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

describe("Service: TestPlayerService", () => {
    let mockbackend: MockBackend;
    let service: TestPlayerService;

    beforeEach(() => {

        let mockRouter = {
            navigate: jasmine.createSpy('navigate')
        };

        let mockCRUDService = {
            insertData(){
                return Observable.of("");
            },
            getRecordById(string, number){
                Observable.of("");
            }
        };

        let mockCommonService = {
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

        let mockSubjectService = {
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

        TestBed.configureTestingModule({
            imports: [HttpModule
            ],
            providers: [
                BaseRequestOptions,
                MockBackend,
                TestPlayerService,
                {provide: CRUDService, useValue: mockCRUDService},
                {provide: CommonService, useValue: mockCommonService},
                {provide: SubjectService, useValue: mockSubjectService},
                {provide: Router, useValue: mockRouter},
                {provide: XHRBackend, useClass: MockBackend}
            ]
        });

    });

    beforeEach(inject([TestPlayerService, XHRBackend], (_service, _mockbackend) => {
        service = _service;
        mockbackend = _mockbackend;
    }));

    it('#getTestDetails should return testDetails', async(() => {
        service.setBaseTestData(3, 3, 3);
        expect(service.maxUserRate).not.toEqual(13);
        service.getTestDetails().subscribe(testDetails => {
            expect(testDetails).toEqual(mockTestDetails);
            expect(service.maxUserRate).toEqual(13);
        });
    }));

    it('#getTestDetails should return Error("test data are absent")', async(() => {
        service.setBaseTestData(4, 3, 3);
        service.getTestDetails().catch((testDetails): void | any => {
            expect(testDetails).toEqual(new Error("test data are absent"));
        });
    }));

    it('should return mocked AnswersByQuestionId', async(() => {
        let response = mockAnswersResponse;
        mockbackend.connections.subscribe(connection => {
            connection.mockRespond(new Response(<ResponseOptions>{body: JSON.stringify(response)}));
        });
        service.getAnswersByQuestion("1").subscribe(answers => {
            expect(answers[0].answer_text).toBe(4);
            expect(answers[1].answer_text).toBe(6);
            expect(answers.length).toBe(2);
        });
    }));

    it('should return mocked checkSAnswer', async(() => {
        let response = mockCheckSanswersResponse;
        mockbackend.connections.subscribe(connection => {
            connection.mockRespond(new Response(<ResponseOptions>{body: JSON.stringify(response)}));
        });
        service.checkSAnswer({}).subscribe(result => {
            expect(result[0].true).toBe(0);
            expect(result[1].true).toBe(1);
            expect(result[2].question_id).toBe(3);
            expect(result.length).toBe(3);
        });
    }));

    it('#prepareQuestionForTest should return Questions[] for test', () => {
        let questions: TestPlayerQuestions[][] = <TestPlayerQuestions[][]>mockPrepareQuestions;
        let testDetails = mockPrepareTestDetails;
        let resultQuestions = mockPrepareResultQuestions;
        expect(service.prepareQuestionForTest(questions, testDetails)).toEqual(resultQuestions);
    });
});