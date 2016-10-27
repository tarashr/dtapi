export const baseUrl:string = 'http://dtapi.local/';
//AUTH action
export const loginUrl:string = baseUrl + "login/index";
export const logoutUrl:string = baseUrl + "login/logout";

//CRUD Action whith entity
export const getSubjectsUrl:string = baseUrl + 'subject/getRecords';
export const getSubjectUrl:string = baseUrl + 'subject/getRecords'; // + id of subject
export const getRangeOfSubjectsUrl:string = baseUrl + 'subject/getRecordsRange';
export const countSubjectsUrl:string = baseUrl + 'subject/countRecords';
export const addSubjectUrl:string = baseUrl + 'subject/insertData';
export const editSubjectUrl:string = baseUrl + 'subject/update'; // + id of subject
export const delSubjectUrl:string = baseUrl + 'subject/del'; // + id of subject
export const getGroupUrl:string = baseUrl + 'group/getRecords';
export const countGroupsUrl:string = baseUrl + 'group/countRecords';
export const getRangeOfGroupUrl:string = baseUrl + 'group/getRecordsRange';
export const getEntityValues:string = baseUrl + 'EntityManager/getEntityValues';
export const getSubjectsBySearchUrl:string = baseUrl + 'subject/getRecordsBySearch/'; // + criteria
export const getSpecialityUrl:string = baseUrl + 'speciality/getRecords';
export const delSpecialityUrl:string = baseUrl + 'speciality/del';
export const addGroupUrl:string = baseUrl + 'group/insertData';
export const getFacultysUrl:string = baseUrl + 'faculty/getRecords';
export const getSpecialitysUrl:string = baseUrl + 'speciality/getRecords';
export const getGroupsBySearchUrl:string = baseUrl + 'group/getRecordsBySearch/'; // + criteria
export const delGroupUrl:string = baseUrl + 'group/del'; // + id of subject
export const getStudentsUrl:string = baseUrl + 'student/getRecords';
export const editGroupUrl:string = baseUrl + 'group/update'; // + id of subject

//Array of entities for statistic page
export const entities:any[] = [
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
export const maxSize:number = 5;
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

export const configEditFaculty = {
    title: "Редагувати факультет",
    list: [
        {name: "Назва факультету", value: "", title: "name"},
        {name: "Опис факультету", value: "", title: "description"},
    ],
    action: "edit",
    labelBtn: "Редагувати"
};