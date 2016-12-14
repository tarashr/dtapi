describe("Login page", function () {

    let login, password, btn, okBtn, exitAdminBtn, exitStudentBtn, backNotFoundBtn;
    browser.get("/~pupkin/DTester/dist");
    login = element(by.css("input[type=text]"));
    password = element(by.css("input[type=password]"));
    btn = element(by.css("button"));

    it("should display correct title", function () {
        expect(browser.getTitle()).toEqual("D-Tester");
    });

    it("should show modal window with wrong login or password message", () => {
        login.sendKeys("adm");
        password.sendKeys("dtapi_admin");
        btn.click().then(() => {
            const message = element(by.css(".modal-body-info-confirm")).getText();
            expect(message).toBe("Неправильний логін або пароль");
            okBtn = element(by.css(".modal-footer button"));
            okBtn.click();
        });
    });

    it("should redirect to admin/statistic page", () => {
        login.clear();
        login.sendKeys("admin");
        password.clear();
        password.sendKeys("dtapi_admin");
        btn.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/admin/statistic");
            });
        });
    });

    it("should redirect to login page", () => {
        exitAdminBtn = element(by.css(".main-menu .navbar-right a"));
        exitAdminBtn.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/login");
            });
        });
    });

    it("should redirect to student/profile page", () => {
        login.clear();
        password.clear();
        login.sendKeys("ivan");
        password.sendKeys("1111");
        btn.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/student/profile");
            });
        });
    });

    it("should redirect to not found page", (done) => {
        browser.get("/~pupkin/DTester/dist/#/admin").then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/notfound");
                done();
            });
        });
    });


    it("should redirect to login page", (done) => {
        backNotFoundBtn = element(by.css(".go-login"));
        backNotFoundBtn.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/login");
                done();
            });
        });
    });

    it("should redirect to student/profile page", () => {
        login.clear();
        password.clear();
        login.sendKeys("ivan");
        password.sendKeys("1111");
        btn.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/student/profile");
            });
        });
    });

    it("should redirect to login page", () => {
        exitStudentBtn = element(by.css(".text-center button"));
        exitStudentBtn.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/login");
            });
        });
    });
});