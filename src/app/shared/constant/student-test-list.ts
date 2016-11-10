// Constants for table.component

export const  headersStudentTestList = [
    // {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Предмет", className: "col-xs-12 col-sm-4"},
    {name: "Назва тесту", className: "col-xs-12 col-sm-4"},
    {name: "Дата", className: "col-xs-12 col-sm-3"},
    {name: "", className: "col-xs-12 col-sm-1"}
];

export const actionsStudentTestList = [
    {
        title: "Запустити тест",
        action: "start",
        glyphicon: "glyphicon glyphicon-play",
        btnClassName: "btn btn-default btn-sm"
    }
];

export const activeTests = [{
    test_name: "",
    subject_id: "",
    subjectName: "",
    test_id: "",
    enabled: ""
}];

export const activeTimeTable = [{
    group_id: this.groupId,
    subject_id: "",
    event_date: ""
}];