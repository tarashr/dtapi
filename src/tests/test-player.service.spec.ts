import {async, TestBed, inject} from "@angular/core/testing";
import {BaseRequestOptions, Response, ResponseOptions, XHRBackend, HttpModule} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {TestPlayerService} from "../app/shared/services/test-player.service";
import {TestPlayerQuestions} from "../app/shared/classes";
import {SubjectService} from "../app/shared/services/subject.service";
import {CRUDService} from "../app/shared/services/crud.service";
import {CommonService} from "../app/shared/services/common.service";
import {Router} from "@angular/router";
import {
    mockTestDetails, mockAnswersResponse, mockCheckSanswersResponse,
    mockPrepareQuestions, mockPrepareTestDetails, mockPrepareResultQuestions, mockRouter, mockCommonService,
    mockCRUDService, mockSubjectService
} from "./test-player.service.mock";

describe("Service: TestPlayerService", () => {
    let mockbackend: MockBackend;
    let service: TestPlayerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
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
        service.setBaseTestData(3, 2, 1);
        service.getTestDetails().subscribe(testDetails => {
            expect(testDetails).toEqual(mockTestDetails);
        });
    }));

    it('#getTestDetails should return Error("test data are absent")', async(() => {
        service.setBaseTestData(4, 2, 1);
        service.getTestDetails().catch((testDetails):any => {
            expect(testDetails).toEqual(new Error("test data are absent"));
        });
    }));

    it('should return mocked AnswersByQuestionId', async(() => {
        mockbackend.connections.subscribe(connection => {
            connection.mockRespond(new Response(<ResponseOptions>{body: JSON.stringify(mockAnswersResponse)}));
        });
        service.getAnswersByQuestion("1").subscribe(answers => {
            expect(answers[0].answer_text).toBe(4);
            expect(answers[1].answer_text).toBe(6);
            expect(answers.length).toBe(2);
        });
    }));

    it('should return mocked checkSAnswer', async(() => {
        mockbackend.connections.subscribe(connection => {
            connection.mockRespond(new Response(<ResponseOptions>{body: JSON.stringify(mockCheckSanswersResponse)}));
        });
        service.checkSAnswer({}).subscribe(result => {
            expect(result[0].true).toBe(0);
            expect(result[1].true).toBe(1);
            expect(result[2].question_id).toBe(3);
            expect(result.length).toBe(3);
        });
    }));

    it('#prepareQuestionForTest should return Questions[] for test', () => {
        const questions: TestPlayerQuestions[][] = <TestPlayerQuestions[][]>mockPrepareQuestions;
        const testDetails = mockPrepareTestDetails;
        const resultQuestions = mockPrepareResultQuestions;
        const prepareQuestion = service.prepareQuestionForTest(questions, testDetails);
        expect(prepareQuestion).toEqual(resultQuestions);
    });
});