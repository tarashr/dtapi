describe("Admin user page", function () {

    browser.get("/~pupkin/DTester/dist");

    it("should redirect to admin/statistic page", () => {
        const login = $("input[type=text]");
        const password = $("input[type=password]");
        const LoginBtn = $("button");
        login.sendKeys("admin");
        password.sendKeys("dtapi_admin");
        browser.sleep(1000);
        LoginBtn.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/admin/statistic");
            });
        });
    });

    it("should redirect to admin/adminUser page", () => {
        const adminUserBtn = $("a[routerLink='adminUser']");
        browser.sleep(1000);
        adminUserBtn.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/admin/adminUser");
            });
        });
    });

    it("should open add modal window", () => {
        const openAddModalBtn = $(".navbar-right div.form-group a.btn");
        browser.sleep(1000);
        openAddModalBtn.click().then(() => {
            const addTitle = $("h4").getText();
            expect(addTitle).toEqual("Додати адміністратора");
        });
    });

    it("should add new admin user", () => {
        const username = $(".modal-body input[name='username']");
        const email = $(".modal-body input[name='email']");
        const password = $("input[name='password']");
        const cpassword = $("input[name='cpassword']");
        const addBtn = $(".modal-footer button:first-child");
        username.sendKeys("adminUserForTesting");
        email.sendKeys("adminUserForTesting@gmail.com");
        password.sendKeys("adminUserForTestingPassword");
        cpassword.sendKeys("adminUserForTestingPassword");
        browser.sleep(1000);
        addBtn.click().then(() => {
            const message = $(".modal-body-info-confirm").getText();
            expect(message).toEqual("adminUserForTesting успішно створено");
            const okBtn = $(".modal-footer button");
            okBtn.click();
        });
    });

    it("should change page", () => {
        $$("li.page-item").count().then((amount) => {
            const lastPageNumber = amount - 3;
            const page = $$("li.page-item").get(lastPageNumber).$("a");
            browser.sleep(1000);
            page.click().then(() => {
                const lastPagBtnClass = $$("li.page-item").get(lastPageNumber).getAttribute("class");
                expect(lastPagBtnClass).toEqual("page-item active");
            });
        });
    });

    it("should delete adminUser", () => {
        const delBtn = $("li.list-group-item:last-child").$("a:last-child");
        browser.sleep(1000);
        delBtn.click().then(() => {
            const message = $(".modal-body-info-confirm").getText();
            expect(message).toEqual("Ви дійсно хочете видалити adminUserForTesting?");
            const okBtn = $(".modal-footer button:first-child");
            browser.sleep(1000);
            okBtn.click().then(() => {
                const message = $(".modal-body-info-confirm").getText();
                expect(message).toEqual("Видалення пройшло успішно.");
                const okBtn = $(".modal-footer button");
                okBtn.click();
            });
        });
    });

    it("should open add modal window", () => {
        const openAddModalBtn = $(".navbar-right div.form-group a.btn");
        browser.sleep(1000);
        openAddModalBtn.click().then(() => {
            const addTitle = $("h4").getText();
            expect(addTitle).toEqual("Додати адміністратора");
        });
    });

    it("should close add modal window", () => {
        const closeAddModalBtn = $(".modal-header .close");
        browser.sleep(1000);
        closeAddModalBtn.click().then(() => {
            const bodyClass = $("body").getAttribute("class");
            expect(bodyClass).toEqual("");
        });
    });

    it("should redirect to login page", () => {
        const exitBtn = $(".glyphicon-log-out");
        browser.sleep(1000);
        exitBtn.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/login");
            });
        });
    });
});