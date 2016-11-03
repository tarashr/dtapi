// Faculty's configs
export const headersFaculty = [
    {name: "№", style: "col-xs-12 col-sm-1"},
    {name: "Назва факультету", style: "col-xs-12 col-sm-4"},
    {name: "Опис Факультету", style: "col-xs-12 col-sm-4"},
    {name: "", style: "col-xs-12 col-sm-3"}
];

export const actionsFaculty = [
    {
        title: "Перейти до груп факультету",
        action: "group",
        style: "glyphicon glyphicon-th",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати факультет",
        action: "edit",
        style: "glyphicon glyphicon-edit",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Видалити факультет",
        action: "delete",
        style: "glyphicon glyphicon-trash",
        btnStyle: "btn btn-danger btn-sm"
    }
];

// Student's configs
export const headersStudentAdmin = [
    {name: "№", style: "col-xs-12 col-sm-1"},
    {name: "ПІБ", style: "col-xs-12 col-sm-3"},
    {name: "№ залікової книжки", style: "col-xs-12 col-sm-3"},
    {name: "Група", style: "col-xs-12 col-sm-3"},
    {name: "", style: "col-xs-12 col-sm-2"}
];

export const actionsStudentAdmin = [
    {
        title: "Перегляд профілю студента",
        action: "group",
        style: "glyphicon glyphicon-user",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати профіль студента",
        action: "edit",
        style: "glyphicon glyphicon-edit",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Видалити профіль студента",
        action: "delete",
        style: "glyphicon glyphicon-trash",
        btnStyle: "btn btn-danger btn-sm"
    }
    /*{
        title: "Профіль студента",
        action: "edit",
        style: "glyphicon glyphicon-user",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Видалити студента",
        action: "delete",
        style: "glyphicon glyphicon-trash",
        btnStyle: "btn btn-danger btn-sm"
    }*/
];