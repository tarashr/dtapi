// Constants for table.component
export const headersQuestion = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Завдання", className: "col-xs-12 col-sm-2"},
    {name: "Рівень", className: "col-xs-12 col-sm-1"},
    {name: "Тип", className: "col-xs-12 col-sm-1"},
    {name: "Вкладення", className: "col-xs-12 col-sm-4"},
    {name: "", className: "col-xs-12 col-sm-2"}
];

export const actionsQuestion = [
    {
        title: "Редагувати завдання",
        action: "edit",
        glyphicon: "glyphicon glyphicon-edit",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити завдання",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }
];

// Constants for add-edit-modal component
export const configAddQuestion = {
    title: "Додати нове завдання",
    list: [
        {name: "Завдання", value: "", title: "task", type: "text"},
        {name: "Рівень", value: "", title: "level", type: "number"},
        {name: "Тип", value: "", title: "type", type: ""},
        {name: "Вкладення", value: "", title: "level", type: "file"}
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configEditQuestion = {
    title: "Редагувати завдання",
    list: [
        {name: "Завдання", value: "", title: "task", type: "text"},
        {name: "Рівень", value: "", title: "level", type: "number"},
        {name: "Тип", value: "", title: "type", type: ""},
        {name: "Вкладення", value: "", title: "level", type: "file"}
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id:""
};