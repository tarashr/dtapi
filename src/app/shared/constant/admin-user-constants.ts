// Constants for table.component
export const headersAdminUser = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Логін", className: "col-xs-12 col-sm-4"},
    {name: "Поштова скринька", className: "col-xs-12 col-sm-4"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsAdminUser = [
    {
        title: "Редагувати дані адміністротора",
        action: "edit",
        glyphicon: "glyphicon glyphicon-edit",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити адміністратора",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }
];

// Constants for add-edit-modal component
export const configAddAdminUser = {
    title: "Додати адміністратора",
    list: [
        {name: "Логін", value: "", title: "username", type: "text", formControlName: "username"},
        {name: "Поштова скринька", value: "", title: "email", type: "email", formControlName: "email"},
        {name: "Пароль", value: "", title: "password", type: "password", formControlName: "password"},
        {name: "Підтвердіть пароль", value: "", title: "passwordConfirm", type: "password", formControlName: "cpassword"}
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configEditAdminUser = {
    title: "Редагувати адміністратора",
    list: [
        {name: "Логін", value: "", title: "username", type: "text", formControlName: "username"},
        {name: "Поштова скринька", value: "", title: "email", type: "email", formControlName: "email"},
        {name: "Пароль", value: "", title: "password", type: "password", formControlName: "password"},
        {name: "Підтвердіть пароль", value: "", title: "passwordConfirm", type: "password", formControlName: "cpassword"}
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: ""
};