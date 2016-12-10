// Constants for table.component
export const headersAnswer = [
    {name: "Текст відповіді", className: "col-xs-12 col-sm-3"},
    {name: "Вкладення", className: "col-xs-12 col-sm-3"},
    {name: "Правильна відповідь", className: "col-xs-12 col-sm-3"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsAnswer = [
    {
        title: "Редагувати відповідь",
        action: "edit",
        glyphicon: "glyphicon glyphicon-edit",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити відповідь",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }
];

// Constants for add-edit-modal component
export const configAddAnswer = {
    title: "Додати нову відповідь",
    list: [
        {name: "Текст відповіді", value: "", title: "answer_text", type: "text", placeholder: "Відповідь для тесту",
            formControlName: "answer", hint: "Текст відповіді не може перевищувати 100 символів"},
    ],
    select: [
        {selectName: "Правильна відповідь", selectItem: [], selected: ""}
    ],
    action: "create",
    labelBtn: "Додати",
    img: {imgName: "Вкладення", value: "", title: "attachment", type: "file"}
};

export const configEditAnswer = {
    title: "Редагувати завдання",
    list: [
        {name: "Текст відповіді", value: "", title: "answer_text", type: "text", placeholder: "Відповідь для тесту",
            formControlName: "answer", hint: "Текст відповіді не може перевищувати 100 символів"},
    ],
    select: [
        {selectName: "Правильна відповідь", selectItem: [], selected: ""}
    ],
    action: "edit",
    labelBtn: "Редагувати",
    id: "",
    img: {imgName: "Вкладення", value: "", title: "attachment", type: "file"}
};