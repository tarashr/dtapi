
const baseUrl:string = 'http://dtapi.local/';

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
export const getEntityValues:string = baseUrl + 'EntityManager/getEntityValues';
