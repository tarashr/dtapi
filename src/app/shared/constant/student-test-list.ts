// Constants for table.component

export const  headersStudentTestList = [
    // {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Предмет", className: "col-xs-12 col-sm-3"},
    {name: "Назва тесту", className: "col-xs-12 col-sm-4"},
    {name: "Час початку", className: "col-xs-12 col-sm-2"},
    {name: "Час кінця", className: "col-xs-12 col-sm-2"},
    {name: "", className: "col-xs-12 col-sm-1"}
];

export const  headersStudentTestResults = [
    // {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва тесту", className: "col-xs-12 col-sm-5"},
    {name: "Дата тестування", className: "col-xs-12 col-sm-5"},
	{name: "Результат", className: "col-xs-12 col-sm-2"}
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
    start_date: ""
}];