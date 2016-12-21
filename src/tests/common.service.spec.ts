import {CommonService} from "../app/shared/services/common.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

describe("CommonService isolated test", () => {
    let service: CommonService;
    let modalService: NgbModal;

    beforeEach(() => {
        service = new CommonService(modalService);
    });

    it("leftPad should add '0' before single digit", () => {
        expect(service.leftPad(5)).toBe("05");
        expect(service.leftPad(0)).toBe("00");
        expect(service.leftPad(-5)).toBe("-05");
    });

    it("leftPad should return param without changes", () => {
        expect(service.leftPad(10)).toBe("10");
        expect(service.leftPad(407)).toBe("407");
    });

    it("formatTime should return formatted date", () => {
        let date = new Date(2016, 11, 16, 11, 15, 7);
        expect(service.formatTime(date, "YYYY-MM-DD")).toBe("2016-12-16");
        expect(service.formatTime(date, "hh:mm:ss")).toBe("11:15:07");
        expect(service.formatTime(date, "DD.MM.YYYY, hh:mm")).toBe("16.12.2016, 11:15");
    });

    it("cryptData should return crypted string", () => {
        expect(service.cryptData(9)).toBe("45c48cce2e2d7fbdea1afc51c7c6ad26");
        expect(service.cryptData(12)).toBe("c20ad4d76fe97759aa27a0c99bff6710");
    });
});