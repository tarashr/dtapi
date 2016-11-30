// Constants for table.component
export const headersQuestion = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Завдання", className: "col-xs-12 col-sm-3"},
    {name: "Рівень", className: "col-xs-12 col-sm-1"},
    {name: "Тип", className: "col-xs-12 col-sm-2"},
    {name: "Вкладення", className: "col-xs-12 col-sm-3"},
    {name: "", className: "col-xs-12 col-sm-2"}
];

export const actionsQuestion = [
    {
        title: "Перейти до відповіді",
        action: "answer",
        glyphicon: "glyphicon glyphicon-list-alt",
        btnClassName: "btn btn-default btn-sm"
    },
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
        {name: "Завдання", value: "", title: "task", type: "text", placeholder: "Опис завдання для тесту",
            formControlName: "entityDescription", hint: "Максимальна довжина опису завдання складає 100 символів"},
    ],
    action: "create",
    labelBtn: "Додати",
    img: {imgName: "Вкладення", value: "", title: "attachment", type: "file"},
    select: [
        {selectName: "Рівень", selectItem: [], selected: ""},
        {selectName: "Тип", selectItem: [], selected: ""}

    ]
};

export const configEditQuestion = {
    title: "Редагувати завдання",
    list: [
        {name: "Завдання", value: "", title: "task", type: "text", placeholder: "Опис завдання для тесту",
            formControlName: "entityDescription", hint: "Максимальна довжина опису завдання складає 100 символів"},
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: "",
    img: {imgName: "Вкладення", value: "", title: "attachment", type: "file"},
    select: [
        {selectName: "Рівень", selectItem: [], selected: ""},
        {selectName: "Тип", selectItem: [], selected: ""}

    ]
};