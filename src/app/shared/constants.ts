
export const baseUrl:string = 'http://dtapi.local/';
//AUTH action
export const loginUrl:string = baseUrl + "login/index";
export const logoutUrl:string = baseUrl + "login/logout";

//CRUD Action which entity
export const getSubjectsUrl:string = baseUrl + 'subject/getRecords';
export const getSubjectUrl:string = baseUrl + 'subject/getRecords'; // + id of subject
export const getRangeOfSubjectsUrl:string = baseUrl + 'subject/getRecordsRange';
export const countSubjectsUrl:string = baseUrl + 'subject/countRecords';
export const addSubjectUrl:string = baseUrl + 'subject/insertData';
export const editSubjectUrl:string = baseUrl + 'subject/update'; // + id of subject
export const delSubjectUrl:string = baseUrl + 'subject/del'; // + id of subject
export const getGroupUrl:string=baseUrl+'group/getRecords';
export const countGroupsUrl:string = baseUrl + 'group/countRecords';
export const getRangeOfGroupUrl:string = baseUrl + 'group/getRecordsRange';
export const getSubjectsBySearchUrl:string = baseUrl + 'subject/getRecordsBySearch/'; // + criteria
export const getSpecialityUrl:string=baseUrl+'speciality/getRecords';
export const delSpecialityUrl:string = baseUrl + 'speciality/del';

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