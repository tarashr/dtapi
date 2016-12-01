// Constants for table.component
export const headersSpeciality = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Код спеціальності", className: "col-xs-12 col-sm-4"},
    {name: "Назва спеціальності", className: "col-xs-12 col-sm-4"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsSpeciality = [
    {
        title: "Перейти до груп спеціальності",
        action: "viewGroup",
        glyphicon: "glyphicon glyphicon-th",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати дані спеціальності",
        action: "edit",
        glyphicon: "glyphicon glyphicon-edit",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити спеціальність",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }
];

// Constants for add-edit-modal component
export const configAddSpeciality = {
    title: "Додати спеціальність",
    list: [
        {name: "Код спеціальності", value: "", title: "code", type: "text", formControlName: "specialityCode",
            hint: "Код може складатись з цифр, пробілів та крапок"},
        {name: "Назва спеціальності", value: "", title: "specialityName", type: "text", formControlName: "name",
            hint: "Назва може складатись тільки з українських чи латинських літер та пробілів"}
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configEditSpeciality = {
    title: "Редагувати спеціальність",
    list: [
        {name: "Код спеціальності", value: "", title: "code", type: "text", formControlName: "specialityCode",
            hint: "Код може складатись з цифр, пробілів та крапок"},
        {name: "Назва спеціальності", value: "", title: "specialityName", type: "text", formControlName: "name",
            hint: "Назва може складатись тільки з українських чи латинських літер та пробілів"}
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: ""
};