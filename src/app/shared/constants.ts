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


export const getTestsBySubjectIdUrl: string = baseUrl + 'getTestsBySubject'; // + id of subject

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
//Pagination
export const maxSize: number = 5;
// Configuration for add-edit-modal component
export const configAddFaculty = {
    title: "Створити факультет",
    list: [
        {name: "Назва факультету", value: "", title: "name"},
        {name: "Опис факультету", value: "", title: "description"},
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configAddSubject = {
    title: "Створити предмет",
    list: [
        {name: "Назва предмету", value: "", title: "name"},
        {name: "Опис предмету", value: "", title: "description"},
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configAddSpeciality = {
    title: "Додати спеціальність",
    list: [
        {name: "Код спеціальності", value: "", title: "code"},
        {name: "Назва спеціальності", value: "", title: "name"}
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configAddTest = {
    title: "Додати тест",
    list: [
        {name: "Назва тесту, value: "", title: "name"},
        {name: "Кількість завдань", value: "", title: "tasks"},
        {name: "Тривалість тесту", value: "", title: "time_for_test"},
        {name: "Доступність", value: "", title: "enabled"},
        {name: "Кількість спроб", value: "", title: "attempts"},
        {name: "Назва предмет", value: "", title: "subject_name"}
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configEditFaculty = {
    title: "Редагувати факультет",
    list: [
        {name: "Назва факультету", value: "", title: "name"},
        {name: "Опис факультету", value: "", title: "description"},
    ],
    action: "edit",
    labelBtn: "Редагувати"
};

export const configEditSubject = {
    title: "Редагувати предмет",
    list: [
        {name: "Назва предмету", value: "", title: "name"},
        {name: "Опис предмету", value: "", title: "description"},
    ],
    action: "edit",
    labelBtn: "Редагувати"
};

export const configEditSpeciality = {
    title: "Редагувати спеціальність",
    list: [
        {name: "Код спеціальності", value: "", title: "code"},
        {name: "Назва спеціальності", value: "", title: "name"}
    ],
    action: "edit",
    labelBtn: "Редагувати"
};

export const configEditTest = {
    title: "Редагувати тест",
    list: [
        {name: "Назва тесту, value: "", title: "name"},
        {name: "Кількість завдань", value: "", title: "tasks"},
        {name: "Тривалість тесту", value: "", title: "time_for_test"},
        {name: "Доступність", value: "", title: "enabled"},
        {name: "Кількість спроб", value: "", title: "attempts"},
        {name: "Назва предмет", value: "", title: "subject_name"}
    ],
    action: "edit",
    labelBtn: "Редагувати"
};


// Functions
export const changeLimit = function ($event: any): void {
    this.limit = $event.target.value;
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

export const delRecord = function (entity: string, id: number) {
    this.offset = (this.page - 1) * this.limit;
    this.crudService.delRecord(entity, id)
        .subscribe(()=>this.refreshData("delete"));
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