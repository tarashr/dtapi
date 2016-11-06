import {InfoModalComponent} from "./components/info-modal/info-modal.component";
export const baseUrl: string = 'http://dtapi.local/';
//AUTH action
export const loginUrl: string = baseUrl + "login/index";
export const logoutUrl: string = baseUrl + "login/logout";

//CRUD Action whith entity
export const getEntityValues: string = baseUrl + 'EntityManager/getEntityValues';
export const getSubjectsBySearchUrl: string = baseUrl + 'subject/getRecordsBySearch/'; // + criteria
export const getSpecialityUrl: string = baseUrl + 'speciality/getRecords';
export const delSpecialityUrl: string = baseUrl + 'speciality/del';
export const getFacultysUrl: string = baseUrl + 'faculty/getRecords';
export const getSpecialitysUrl: string = baseUrl + 'speciality/getRecords';
export const getGroupsBySearchUrl: string = baseUrl + 'group/getRecordsBySearch/'; // + criteria
export const getStudentsUrl: string = baseUrl + 'student/getRecords';
export const editGroupUrl: string = baseUrl + 'group/update'; // + id of subject


export const getTestsBySubjectIdUrl: string = baseUrl + 'test/getTestsBySubject'; // + id of subject
export const getTimeTableForSubjectUrl: string = baseUrl + 'timeTable/getTimeTablesForSubject'; // + id of subject
export const getTestDetailsByTestUrl: string = baseUrl + 'testDetail/getTestDetailsByTest'; // + id of subject
export const getQuestionsByLevelRandUrl: string = baseUrl + "question/getQuestionsByLevelRand"; // + test_id + level + number
export const getRecordsRangeByTestUrl: string = baseUrl + "question/getRecordsRangeByTest"; // + test_id + limit + offset
export const countRecordsByTestUrl: string = baseUrl + "question/countRecordsByTest"; // + test_id

//Array of entities for statistic page
export const entities: any[] = [
    {
        name: "faculty",
        count: "...",
        nameForIteration: "факультетів"
    },
    {
        name: "speciality",
        count: "...",
        nameForIteration: "спеціальностей"
    },
    {
        name: "group",
        count: "...",
        nameForIteration: "груп"
    },
    {
        name: "student",
        count: "...",
        nameForIteration: "студентів"
    },
    {
        name: "subject",
        count: "...",
        nameForIteration: "предметів"
    },
    {
        name: "test",
        count: "...",
        nameForIteration: "тестів"
    }
];

// Pagination

export const maxSize: number = 5;


// Configuration for add-edit-modal component

export const configAddFaculty = {
    title: "Створити факультет",
    list: [
        {name: "Назва факультету", value: "", title: "name", type: "text"},
        {name: "Опис факультету", value: "", title: "description", type: "text"},
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configAddSubject = {
    title: "Створити предмет",
    list: [
        {name: "Назва предмету", value: "", title: "name", type: "text"},
        {name: "Опис предмету", value: "", title: "description", type: "text"},
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configAddAdminUser = {
    title: "Додати адміністратора",
    list: [
        {name: "Логін", value: "", title: "username", type: "text"},
        {name: "Поштова скринька", value: "", title: "email", type: "email"},
        {name: "Пароль", value: "", title: "password", type: "password"},
        {name: "Підтвердіть пароль", value: "", title: "passwordConfirm", type: "password"}
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configAddGroup = {
    title: "Додати групу",
    list: [
        {name: "Назва групи", value: "", title: "name", type: "text"},
        {name: "Факультет", value: "", title: "facultyName", type: "text"},
        {name: "Спеціальність", value: "", title: "specialityName", type: "text"}
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configAddSpeciality = {
    title: "Додати спеціальність",
    list: [
        {name: "Код спеціальності", value: "", title: "code", type: "text"},
        {name: "Назва спеціальності", value: "", title: "name", type: "text"}
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configAddTest = {
    title: "Додати тест",
    list: [
        {name: "Назва тесту", value: "", title: "name", type: "text"},
        {name: "Кількість завдань", value: "", title: "tasks", type: "number"},
        {name: "Тривалість тесту", value: "", title: "time_for_test", type: "text"},
        {name: "Кількість спроб", value: "", title: "attempts", type: "number"}
    ],
    action: "create",
    labelBtn: "Додати",
    select: [
        {selectName: "Доступність", selectItem: ["Не доступно", "Доступно"], selected: ""}
    ]
};

export const configAddTimeTable = {
    title: "Додати новий розклад проведення тестування",
    list: [
        {name: "Дата", value: "", title: "date", type: "data"},
    ],
    action: "create",
    labelBtn: "Зареєструвати",
    select: [
        {selectName: "Групи", selectItem: [], selected: ""}
    ]
};

export const configAddTestDetail = {
    title: "Додати новий параметр тесту",
    list: [
        {name: "Рівень", value: "", title: "level", type: "number"},
        {name: "Кількість завдань", value: "", title: "tasks", type: "number"},
        {name: "Кількість балів", value: "", title: "rate", type: "number"}
    ],
    action: "create",
    labelBtn: "Зареєструвати"
};

export const configAddQuestion = {
    title: "Додати нове завдання",
    list: [
        {name: "Завдання", value: "", title: "task", type: "text"},
        {name: "Рівень", value: "", title: "level", type: "number"},
        {name: "Тип", value: "", title: "type", type: ""},
        {name: "Вкладення", value: "", title: "level", type: ""}
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configEditFaculty = {
    title: "Редагувати факультет",
    list: [
        {name: "Назва факультету", value: "", title: "name", type: "text"},
        {name: "Опис факультету", value: "", title: "description", type: "text"},
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: ""
};

export const configEditAdminUser = {
    title: "Редагувати адміністратора",
    list: [
        {name: "Логін", value: "", title: "username", type: "text"},
        {name: "Поштова скринька", value: "", title: "email", type: "email"},
        {name: "Пароль", value: "", title: "password", type: "password"},
        {name: "Підтвердіть пароль", value: "", title: "passwordConfirm", type: "password"}
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: ""
};

export const configEditGroup = {
    title: "Редагувати групу",
    list: [
        {name: "Назва групи", value: "", title: "name", type: "text"},
        {name: "Факультет", value: "", title: "facultyName", type: "text"},
        {name: "Спеціальність", value: "", title: "specialityName", type: "text"}
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: ""
};

export const configEditSubject = {
    title: "Редагувати предмет",
    list: [
        {name: "Назва предмету", value: "", title: "name", type: "text"},
        {name: "Опис предмету", value: "", title: "description", type: "text"},
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: ""
};

export const configEditSpeciality = {
    title: "Редагувати спеціальність",
    list: [
        {name: "Код спеціальності", value: "", title: "code", type: "text"},
        {name: "Назва спеціальності", value: "", title: "name", type: "text"}
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: ""
};

export const configEditTest = {
    title: "Редагувати тест",
    list: [
        {name: "Назва тесту", value: "", title: "name", type: "text"},
        {name: "Кількість завдань", value: "", title: "tasks", type: "text"},
        {name: "Тривалість тесту", value: "", title: "time_for_test", type: "text"},
        {name: "Кількість спроб", value: "", title: "attempts", type: "text"},
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: "",
    select: [
        {selectName: "Доступність", selectItem: ["Не доступно", "Доступно"], selected: ""}
    ]
};

export const configEditTimeTable = {
    title: "Редагувати розклад проведення тестування",
    list: [
        {name: "Дата", value: "", title: "date", type: "date"},
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: "",
    select: [
        {selectName: "Групи", selectItem: [], selected: ""}
    ]
};

export const configEditTestDetail = {
    title: "Редагувати параметр тесту",
    list: [
        {name: "Рівень", value: "", title: "level", type: "number"},
        {name: "Кількість завдань", value: "", title: "tasks", type: "number"},
        {name: "Кількість балів", value: "", title: "rate", type: "number"}
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: ""
};

export const configEditQuestion = {
    title: "Редагувати завдання",
    list: [
        {name: "Завдання", value: "", title: "task", type: "text"},
        {name: "Рівень", value: "", title: "level", type: "number"},
        {name: "Тип", value: "", title: "type", type: ""},
        {name: "Вкладення", value: "", title: "level", type: ""}
    ],
    action: "edit",
    labelBtn: "Редагувати"
};

// Functions
export const changeLimit = function (limit: number): void {
    this.limit = limit;
    this.offset = 0;
    this.page = 1;
    this.getRecordsRange();
};

export const pageChange = function (num: number) {
    if (!num) {
        this.page = 1;
        return;
    }
    this.page = num;
    this.offset = (this.page - 1) * this.limit;
    this.getRecordsRange();
};

export const getCountRecords = function () {
    this.crudService.getCountRecords(this.entity)
        .subscribe(
            data => {
                this.entityDataLength = +data.numberOfRecords;
                this.getRecordsRange();
            },
            error=>console.log("error: ", error)
        );
};

export const getRecordsRange = function () {
    this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
        .subscribe(
            data => this.entityData = data,
            error=> console.log("error: ", error))
};

export const successEventModal = function () {
    this.modalInfoConfig.action = "info";
    this.modalInfoConfig.title = "Повідомлення";
    const modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
    modalRef.componentInstance.config = this.modalInfoConfig;
};

export const delRecord = function (entity: string, id: number) {
    this.offset = (this.page - 1) * this.limit;
    this.crudService.delRecord(entity, id)
        .subscribe(()=> {
            this.modalInfoConfig.infoString = `Видалення пройшло успішно.`;
            this.modalInfoConfig.action = "info";
            const modalRef = this.modalService.open(InfoModalComponent, {size: "sm"});
            modalRef.componentInstance.config = this.modalInfoConfig;
            this.refreshData("delete")
        });
};

export const findEntity = function ($event) {
    this.search = $event.target.value;
    if (this.search.length === 0) {
        this.offset = 0;
        this.page = 1;
        this.getCountRecords();
        return;
    }

    this.crudService.getRecordsBySearch(this.entity, this.search)
        .subscribe(data => {
            if (data.response == "no records") {
                this.entityData = [];
                return;
            }
            this.page = 1;
            this.entityData = data;
        }, error=>console.log("error: ", error));
};

export const refreshData = function (action: string) {
    if (action === "delete" && this.entityData.length === 1 && this.entityDataLength > 1) {
        this.offset = (this.page - 2) * this.limit;
        this.page -= 1;
    } else if (this.entityData.length > 1) {
        this.offset = (this.page - 1) * this.limit;
    }

    this.crudService.getCountRecords(this.entity)
        .subscribe(
            data => {
                this.entityDataLength = +data.numberOfRecords;
                this.getRecordsRange();
            },
            error=>console.log(error)
        );
}