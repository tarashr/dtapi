// Constants for table.component
export const headersFaculty = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва факультету", className: "col-xs-12 col-sm-4"},
    {name: "Опис Факультету", className: "col-xs-12 col-sm-4"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsFaculty = [
    {
        title: "Перейти до груп факультету",
        action: "group",
        glyphicon: "glyphicon glyphicon-th",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати факультет",
        action: "edit",
        glyphicon: "glyphicon glyphicon-edit",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити факультет",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }
];

// Constants for add-edit-modal component
export const configAddFaculty = {
    title: "Створити факультет",
    list: [
        {name: "Назва факультету", value: "", title: "name", type: "text"},
        {name: "Опис факультету", value: "", title: "description", type: "text"},
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