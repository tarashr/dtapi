// Constants for table.component
export const headersTestDetail = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Рівень", className: "col-xs-12 col-sm-2"},
    {name: "Кількість завдань", className: "col-xs-12 col-sm-3"},
    {name: "Кількість балів", className: "col-xs-12 col-sm-3"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsTestDetail = [
    {
        title: "Редагувати параметр",
        action: "edit",
        glyphicon: "glyphicon glyphicon-edit",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити параметр",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }
];

// Constants for add-edit-modal component
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