describe("Student registration", function () {

    let login, password, btn, okBtn, exitAdminBtn, studentTab, studentNew, studentSurname, studentName,
        studentFname, studentFaculty, studentGroup, studentGradebook_id, studentEmail, studentUserLogin,
        studentUserPassword, studentRegisred, lastPagination, deletedButton, message;
    browser.get("/~pupkin/DTester/dist");
    login = element(by.css("input[type=text]"));
    password = element(by.css("input[type=password]"));
    btn = element(by.css("button"));

    it("should redirect to admin/student page", () => {
        login.sendKeys("admin");
        browser.sleep(1000);
        password.sendKeys("dtapi_admin");
        browser.sleep(1000);
        btn.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/admin/statistic");
            });
        });
        browser.sleep(1000);
        studentTab = element(by.css("a[routerLink='student']"));
        studentTab.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/admin/student");
            });
        });
    });

    it("should redirect to admin/student/student-profile", () => {
        browser.sleep(1000);
        studentNew = element(by.cssContainingText('.btn', 'Додати'));
        studentNew.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/admin/student/student-profile");
            });
        });
    });

    it("should register new student", () => {
        browser.sleep(1000);
        studentSurname = element(by.id("surname"));
        studentName = element(by.id("name"));
        studentFname = element(by.id("fname"));
        studentGradebook_id = element(by.id("gradebook_id"));
        studentEmail = element(by.id("email"));
        studentUserLogin = element(by.id("userLogin"));
        studentUserPassword = element(by.id("userPassword"));
        studentFaculty = element(by.cssContainingText('option', 'Інститут інформаційних технологій'));
        studentGroup = element(by.cssContainingText('option', 'ПІ-11-1'));
        studentRegisred = element(by.cssContainingText('.btn', 'Зберегти дані'));

        studentSurname.sendKeys("Янкіна");
        studentName.sendKeys("Олена");
        studentFname.sendKeys("Анатоліївна");
        studentFaculty.click();
        studentGroup.click();
        studentGradebook_id.sendKeys("МИТ-000000001");
        studentEmail.sendKeys("student22@gmail.com");
        studentUserLogin.sendKeys("student22");
        studentUserPassword.sendKeys("00000000");
        browser.sleep(1000);
        studentRegisred.click().then(() => {
            message = element(by.css(".modal-body-info-confirm")).getText();
            expect(message).toBe("Створено профіль студента Янкіна Олена Анатоліївна");
            okBtn = element(by.css(".modal-footer button"));
            browser.sleep(1000);
            okBtn.click();
        });
        browser.sleep(1000);
    });

    it("should redirect last student pagination page", () => {
        studentTab.click();
        browser.sleep(1000);
        lastPagination =  element(by.cssContainingText(".page-link","»»"));
        lastPagination.click();
        browser.sleep(1000);
    });

    it("should delete created student", () => {
        deletedButton = element(by.css('a[title="Видалити профіль студента: Янкіна Олена Анатоліївна"]'));
        deletedButton.click();
        browser.sleep(1000);
        message = element(by.css(".modal-body-info-confirm")).getText();
        expect(message).toBe("Ви дійсно хочете видалити профіль студента: Янкіна Олена Анатоліївна?");
        browser.sleep(1000);
        okBtn = element(by.cssContainingText(".btn","ТАК"));
        okBtn.click();
        browser.sleep(1000);
        message = element(by.css(".modal-body-info-confirm")).getText();
        expect(message).toBe("Видалення пройшло успішно.");
        okBtn = element(by.cssContainingText(".btn","OK"));
        okBtn.click();
        browser.sleep(1000);
    });

    it("should redirect to login page", () => {
        exitAdminBtn = element(by.css("span.glyphicon-log-out"));
        exitAdminBtn.click().then(() => {
            browser.getCurrentUrl().then((url) => {
                expect(url.split("#")[1]).toBe("/login");
            });
        });
        browser.sleep(1000);
    });
});