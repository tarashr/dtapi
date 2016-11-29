import {ConfigModalAddEdit} from "../classes/configs/config-modal-add-edit";
import {ConfigTableAction} from "../classes/configs/config-table-action";
import {ConfigTableHeader} from "../classes/configs/config-table-header";
export const addTitle: string = "Створити новий факультет";
export const searchTitle: string = "Введіть дані для пошуку";
export const entityTitle: string = "Факультети";
export const selectLimitTitle: string = "Виберіть кількість факультетів на сторінці";
// Constants for table.component
export const headersFaculty: ConfigTableHeader[] = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва факультету", className: "col-xs-12 col-sm-4"},
    {name: "Опис Факультету", className: "col-xs-12 col-sm-4"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsFaculty: ConfigTableAction[] = [
    {
        title: "Перейти до груп факультету",
        action: "group",
        glyphicon: "glyphicon glyphicon-th",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати факультет",
        action: "edit",
        glyphicon: "glyphicon glyphicon-edit",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити факультет",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }
];

// Constants for add-edit-modal component
export const configAddFaculty: ConfigModalAddEdit = <ConfigModalAddEdit>{
    title: "Створити факультет",
    list: [
        {name: "Назва факультету", value: "", title: "name", type: "text", formControlName: "name",
            hint: "Назва може складатись тільки з українських літер та пробілів"},
        {name: "Опис факультету", value: "", title: "description", type: "text", formControlName: "entityDescription",
            hint: "Максимальна довжина опису 100 символів"},
    ],
    action: "create",
    labelBtn: "Додати"
};

export const configEditFaculty: ConfigModalAddEdit = <ConfigModalAddEdit>{
    title: "Редагувати факультет",
    list: [
        {name: "Назва факультету", value: "", title: "name", type: "text", formControlName: "name",
            hint: "Назва може складатись тільки з українських літер та пробілів"},
        {name: "Опис факультету", value: "", title: "description", type: "text", formControlName: "entityDescription",
            hint: "Максимальна довжина опису 100 символів"},
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: ""
};
