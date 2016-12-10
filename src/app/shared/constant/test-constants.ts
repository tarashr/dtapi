// Constants for table.component
export const headersTest = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва тесту", className: "col-xs-12 col-sm-2"},
    {name: "Завдань", className: "col-xs-12 col-sm-1 text-center"},
    {name: "Тривалість", className: "col-xs-12 col-sm-2 text-center"},
    {name: "Cпроб", className: "col-xs-12 col-sm-1 text-center"},
    {name: "Статус", className: "col-xs-12 col-sm-2"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsTest = [
    {
        title: "Детальніше про тест",
        action: "testDetail",
        glyphicon: "glyphicon glyphicon-info-sign",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Завдання",
        action: "question",
        glyphicon: "glyphicon glyphicon-tasks",
        btnClassName: "btn btn-default btn-sm"

    },
    {
        title: "Редагувати тест",
        action: "edit",
        glyphicon: "glyphicon glyphicon-edit",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити тест",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }
];

// Constants for add-edit-modal component
export const configEditTest = {
    title: "Редагувати тест",
    list: [
        {name: "Назва тесту", value: "", title: "name", type: "text", formControlName: "name",
            hint: "Назва може складатись тільки з українських чи латинських літер та пробілів"},
        {name: "Кількість завдань", value: "", title: "tasks", type: "text", formControlName: "count",
            hint: "Допускається використовувати тільки цифри"},
        {name: "Тривалість тесту", value: "", title: "time_for_test", type: "text", formControlName: "testTime/Rate",
            hint: "Допускається використовувати тільки цифри"},
        {name: "Кількість спроб", value: "", title: "attempts", type: "text", formControlName: "testAttempts",
            hint: "Допускається використовувати тільки цифри (максимальне значення 255)"},
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: "",
    select: [
        {selectName: "Статус", selectItem: ["Не доступно", "Доступно"], selected: ""}
    ]
};

export const configAddTest = {
    title: "Додати тест",
    list: [
        {name: "Назва тесту", value: "", title: "name", type: "text", placeholder: "Вкажіть назву тесту",
            formControlName: "name", hint: "Назва може складатись тільки з українських чи латинських літер та пробілів"},
        {name: "Кількість завдань", value: "", title: "tasks", type: "text", placeholder: "Задайте кількість завдань",
            formControlName: "count", hint: "Допускається використовувати тільки цифри"},
        {name: "Тривалість тесту", value: "", title: "time_for_test", type: "text", placeholder: "Встановіть час, хв",
            formControlName: "testTime/Rate", hint: "Допускається використовувати тільки цифри"},
        {name: "Кількість спроб", value: "", title: "attempts", type: "text", placeholder: "Встановіть кількість спроб",
            formControlName: "testAttempts", hint: "Допускається використовувати тільки цифри (максимальне значення 255)"}
    ],
    action: "create",
    labelBtn: "Додати",
    select: [
        {selectName: "Статус", selectItem: ["Не доступно", "Доступно"], selected: ""}
    ]
};


