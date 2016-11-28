// Constants for table.component
export const headersGroupTimeTable = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва предмету", className: "col-xs-12 col-sm-3"},
    {name: "Дата початку", className: "col-xs-12 col-sm-2"},
    {name: "Час початку", className: "col-xs-12 col-sm-1"},
    {name: "Дата кінця", className: "col-xs-12 col-sm-2"},
    {name: "Час кінця", className: "col-xs-12 col-sm-1"},
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
        {name: "Дата початку", value: "", title: "date", type: "date", placeholder: "РРРР-ММ-ДД"},
        {name: "Час початку", value: "", title: "date", type: "time", placeholder: "год:хв"},
        {name: "Дата кінця", value: "", title: "time", type: "date", placeholder: "РРРР-ММ-ДД"},
        {name: "Час кінця", value: "", title: "time", type: "time", placeholder: "год:хв"},
    ],
    action: "create",
    labelBtn: "Назначити",
    select: [
        {selectName: "Предмети", selectItem: [], selected: ""}
    ],
};

export const configEditGroupTimeTable = {
    title: "Редагувати тестування",
    list: [
        {name: "Дата початку", value: {}, title: "date", type: "date", placeholder: "РРРР-ММ-ДД"},
        {name: "Час початку", value: "", title: "time", type: "time", placeholder: "год:хв"},
        {name: "Дата кінця", value: {}, title: "date", type: "date", placeholder: "РРРР-ММ-ДД"},
        {name: "Час кінця", value: "", title: "time", type: "time", placeholder: "год:хв"}
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: "",
    select: [
        {selectName: "Предмети", selectItem: [], selected: ""}
    ]
};