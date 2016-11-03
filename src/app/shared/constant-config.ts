// Faculty's configs
export const headersFaculty = [
    {name: "№", style: "col-xs-12 col-sm-1"},
    {name: "Назва факультету", style: "col-xs-12 col-sm-4"},
    {name: "Опис Факультету", style: "col-xs-12 col-sm-4"},
    {name: "", style: "col-xs-12 col-sm-3"}
];

export const actionsFaculty = [
    {
        title: "Перейти до груп факультету",
        action: "group",
        style: "glyphicon glyphicon-th",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати факультет",
        action: "edit",
        style: "glyphicon glyphicon-edit",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Видалити факультет",
        action: "delete",
        style: "glyphicon glyphicon-trash",
        btnStyle: "btn btn-danger btn-sm"
    }
];

// Student's configs
export const headersStudentAdmin = [
    {name: "№", style: "col-xs-12 col-sm-1"},
    {name: "ПІБ", style: "col-xs-12 col-sm-3"},
    {name: "№ залікової книжки", style: "col-xs-12 col-sm-3"},
    {name: "Група", style: "col-xs-12 col-sm-3"},
    {name: "", style: "col-xs-12 col-sm-2"}
];

export const actionsStudentAdmin = [
    {
        title: "Перегляд профілю студента",
        action: "group",
        style: "glyphicon glyphicon-user",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати профіль студента",
        action: "edit",
        style: "glyphicon glyphicon-edit",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Видалити профіль студента",
        action: "delete",
        style: "glyphicon glyphicon-trash",
        btnStyle: "btn btn-danger btn-sm"
    }];

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

// adminUser's configs
export const headersAdminUser = [
    {name: "№", style: "col-xs-12 col-sm-1"},
    {name: "Логін", style: "col-xs-12 col-sm-4"},
    {name: "Поштова скринька", style: "col-xs-12 col-sm-4"},
    {name: "", style: "col-xs-12 col-sm-3"}
];

export const actionsAdminUser = [
    {
        title: "Редагувати дані адміністротора",
        action: "edit",
        style: "glyphicon glyphicon-edit",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Видалити адміністратора",
        action: "delete",
        style: "glyphicon glyphicon-trash",
        btnStyle: "btn btn-danger btn-sm"
    }
];

// Specialities configs
export const headersSpeciality = [
    {name: "№", style: "col-xs-12 col-sm-1"},
    {name: "Код спеціальності", style: "col-xs-12 col-sm-4"},
    {name: "Назва спеціальності", style: "col-xs-12 col-sm-4"},
    {name: "", style: "col-xs-12 col-sm-3"}
];

export const actionsSpeciality = [
    {
        title: "Перейти до груп спеціальності",
        action: "group",
        style: "glyphicon glyphicon-th",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати дані адміністротора",
        action: "edit",
        style: "glyphicon glyphicon-edit",
        btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Видалити адміністратора",
        action: "delete",
        style: "glyphicon glyphicon-trash",
        btnStyle: "btn btn-danger btn-sm"
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

