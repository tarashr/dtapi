// Faculty's configs
export const headersFaculty = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва факультету", className: "col-xs-12 col-sm-4"},
    {name: "Опис Факультету", className: "col-xs-12 col-sm-4"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsFaculty = [
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

// Subject's config
export const headersSubject = [
    {name: "№", style: "col-xs-12 col-sm-1"},
    {name: "Назва предмету", style: "col-xs-12 col-sm-4"},
    {name: "Опис предмету", style: "col-xs-12 col-sm-4"},
    {name: "", style: "col-xs-12 col-sm-3"}
];

export const actionsSubject = [
    {
        title: "Перейти до тестів", action: "test",
        style: "glyphicon glyphicon-check", btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Розклад тестів", action: "shedule",
        style: "glyphicon glyphicon-th", btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати предмет", action: "edit",
        style: "glyphicon glyphicon-edit", btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Видалити предмет", action: "delete",
        style: "glyphicon glyphicon-trash", btnStyle: "btn btn-danger btn-sm"
    }
];

export const headersTest = [
    {name: "№", style: "col-xs-12 col-sm-1"},
    {name: "Назва тесту", style: "col-xs-12 col-sm-2"},
    {name: "Завдань", style: "col-xs-12 col-sm-1"},
    {name: "Тривалість", style: "col-xs-12 col-sm-2"},
    {name: "Статус", style: "col-xs-12 col-sm-2"},
    {name: "Cпроб", style: "col-xs-12 col-sm-1"},
    {name: "", style: "col-xs-12 col-sm-3"}
];

export const actionsTest = [
    {
        title: "Детальніше про тест", action: "testDetaile",
        style: "glyphicon glyphicon-th", btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Завдання", action: "task",
        style: "glyphicon glyphicon-th", btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати тест", action: "edit",
        style: "glyphicon glyphicon-edit", btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Видалити тест", action: "delete",
        style: "glyphicon glyphicon-trash", btnStyle: "btn btn-danger btn-sm"
    }
];