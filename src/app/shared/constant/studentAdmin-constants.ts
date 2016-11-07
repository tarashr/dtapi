// Student's constants for table.component
export const headersStudentAdmin = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "ПІБ", className: "col-xs-12 col-sm-3"},
    {name: "№ залікової книжки", className: "col-xs-12 col-sm-3"},
    {name: "Група", className: "col-xs-12 col-sm-3"},
    {name: "", className: "col-xs-12 col-sm-2"}
];

export const actionsStudentAdmin = [
    {
        title: "Переглянути профіль студента",
        action: "view",
        glyphicon: "glyphicon glyphicon-user",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити профіль студента",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }];