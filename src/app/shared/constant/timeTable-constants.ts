// Constants for table.component
export const headersTimeTable = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва групи", className: "col-xs-12 col-sm-4"},
    {name: "Дата", className: "col-xs-12 col-sm-3"},
    {name: "", className: "col-xs-12 col-sm-4"}
];

export const actionsTimeTable = [
    {
        title: "Редагувати розклад",
        action: "edit",
        glyphicon: "glyphicon glyphicon-edit",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити розклад",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }
];

// Constants for add-edit-modal component
export const configAddTimeTable = {
    title: "Додати нову подію у розклад",
    list: [
        {name: "Дата", value: "", title: "date", type: "text", placeholder: "РРРР-ММ-ДД"},
    ],
    action: "create",
    labelBtn: "Додати",
    select: [
        {selectName: "Групи", selectItem: [], selected: ""}
    ]
};

export const configEditTimeTable = {
    title: "Додати подію",
    list: [
        {name: "Дата", value: {}||"", title: "date", type: "text"},
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: "",
    select: [
        {selectName: "Групи", selectItem: [], selected: ""}
    ]
};