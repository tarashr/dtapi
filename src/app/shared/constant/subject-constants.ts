// varibles for common table
export const headersSubject = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва предмету", className: "col-xs-12 col-sm-4"},
    {name: "Опис предмету", className: "col-xs-12 col-sm-4"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsSubject = [
    {
        title: "Перейти до тестів",
        action: "test",
        glyphicon: "glyphicon glyphicon-check",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Розклад тестів",
        action: "timeTable",
        glyphicon: "glyphicon glyphicon-calendar",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати предмет",
        action: "edit",
        glyphicon: "glyphicon glyphicon-edit",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити предмет",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }
];


// for add-edit modal
export const configAddSubject = {
    title: "Створити предмет",
    list: [
        {name: "Назва предмету", value: "", title: "name", type: "text", formControlName: "name",
            hint: "Назва може складатись тільки з українських чи латинських літер та пробілів"},
        {name: "Опис предмету", value: "", title: "description", type: "text", formControlName: "entityDescription",
            hint: "Максимальна довжина опису 100 символів"}
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configEditSubject = {
    title: "Редагувати предмет",
    list: [
        {name: "Назва предмету", value: "", title: "name", type: "text", formControlName: "name",
            hint: "Назва може складатись тільки з українських чи латинських літер та пробілів"},
        {name: "Опис предмету", value: "", title: "description", type: "text", formControlName: "entityDescription",
            hint: "Максимальна довжина опису 100 символів"}
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: ""
};