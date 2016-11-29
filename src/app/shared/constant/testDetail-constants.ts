// Constants for table.component
export const headersTestDetail = [
    {name: "№", className: "col-xs-12 col-sm-1 text-center"},
    {name: "Рівень", className: "col-xs-12 col-sm-2 text-center"},
    {name: "Кількість завдань", className: "col-xs-12 col-sm-3 text-center"},
    {name: "Кількість балів", className: "col-xs-12 col-sm-3 text-center"},
    {name: "", className: "col-xs-12 col-sm-3 text-center"}
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
        {name: "Кількість завдань", value: "", title: "tasks", type: "text", placeholder: "Вкажіть кількість завдань",
            formControlName: "count", hint: "Допускається використовувати тільки цифри"},
        {name: "Кількість балів", value: "", title: "rate", type: "text", placeholder: "Вкажіть кількість балів",
            formControlName: "testTime/Rate", hint: "Допускається використовувати тільки цифри"}
    ],
    action: "create",
    labelBtn: "Додати",
    select: [
        {selectName: "Рівень", selectItem: [], selected: ""}
    ]
};

export const configEditTestDetail = {
    title: "Редагувати параметр тесту",
    list: [
        {name: "Кількість завдань", value: "", title: "tasks", type: "text", placeholder: "Вкажіть кількість завдань",
            formControlName: "count", hint: "Допускається використовувати тільки цифри"},
        {name: "Кількість балів", value: "", title: "rate", type: "text", placeholder: "Вкажіть кількість балів",
            formControlName: "testTime/Rate", hint: "Допускається використовувати тільки цифри"}
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: "",
    select: [
        {selectName: "Рівень", selectItem: [], selected: ""}
    ]
};