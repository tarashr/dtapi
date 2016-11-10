// Constants for table.component
export const headersGroupTimeTable = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва предмету", className: "col-xs-12 col-sm-5"},
    {name: "Дата проведення тестування", className: "col-xs-12 col-sm-4"},
    {name: "", className: "col-xs-12 col-sm-2"}
];

export const actionsGroupTimeTable = [
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
export const configAddGroupTimeTable = {
    title: "Назначити тестування",
    list: [
        {name: "Дата", value: "", title: "date", type: "data", placeholder: "РРРР-ММ-ДД"},
    ],
    action: "create",
    labelBtn: "Назначити",
    select: [
        {selectName: "Предмети", selectItem: [], selected: ""}
    ]
};

export const configEditGroupTimeTable = {
    title: "Редагувати тестування",
    list: [
        {name: "Дата", value: "", title: "date", type: "date"},
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: "",
    select: [
        {selectName: "Предмети", selectItem: [], selected: ""}
    ]
};