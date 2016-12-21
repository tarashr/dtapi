import {GroupService} from "../app/shared/services/group.service";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {PieChartDataBefore, PieChartDataAfter} from "./group.service.mock.data";

describe("GroupServise isolated test", () => {
    let service: GroupService;
    let http: Http;
    let router: Router;

    beforeEach(() => {
        service = new GroupService(http, router);
    });

    it("toNationalRate should take rate in percentage as a parameter and return rate according national rate system", () => {
        expect(service.toNationalRate(0)).toBe("Незадовільно");
        expect(service.toNationalRate(59.999)).toBe("Незадовільно");
        expect(service.toNationalRate(60)).toBe("Задовільно");
        expect(service.toNationalRate(74.999)).toBe("Задовільно");
        expect(service.toNationalRate(75)).toBe("Добре");
        expect(service.toNationalRate(89.999)).toBe("Добре");
        expect(service.toNationalRate(90)).toBe("Відмінно");
        expect(service.toNationalRate(100)).toBe("Відмінно");
    });

    it("toNationalRate should return message when passing data is invalid", () => {
        expect(service.toNationalRate(-0.000001)).toBe("Неправильні дані");
        expect(service.toNationalRate(100.000001)).toBe("Неправильні дані");
    });

    it("toECTSRate should take rate in percentage as a parameter and return rate according ECTS rate system", () => {
        expect(service.toECTSRate(0)).toBe("F");
        expect(service.toECTSRate(34.999)).toBe("F");
        expect(service.toECTSRate(35)).toBe("FX");
        expect(service.toECTSRate(59.999)).toBe("FX");
        expect(service.toECTSRate(60)).toBe("E");
        expect(service.toECTSRate(66.999)).toBe("E");
        expect(service.toECTSRate(67)).toBe("D");
        expect(service.toECTSRate(74.999)).toBe("D");
        expect(service.toECTSRate(75)).toBe("C");
        expect(service.toECTSRate(81.999)).toBe("C");
        expect(service.toECTSRate(82)).toBe("B");
        expect(service.toECTSRate(89.999)).toBe("B");
        expect(service.toECTSRate(90)).toBe("A");
        expect(service.toECTSRate(100)).toBe("A");
    });

    it("toECTSRate should return message when passing data is invalid", () => {
        expect(service.toECTSRate(-0.000001)).toBe("Неправильні дані");
        expect(service.toECTSRate(100.000001)).toBe("Неправильні дані");
    });

    it("formPieChartData should transform data for pieChart", () => {
        const methodDataInput = JSON.stringify(service.formPieChartData(PieChartDataBefore));
        const methodDataOutput = JSON.stringify(PieChartDataAfter);
        expect(methodDataInput).toBe(methodDataOutput);
    });
});