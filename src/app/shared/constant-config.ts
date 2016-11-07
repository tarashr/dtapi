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

// Student's configs
export const headersStudentAdmin = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "ПІБ", className: "col-xs-12 col-sm-3"},
    {name: "№ залікової книжки", className: "col-xs-12 col-sm-3"},
    {name: "Група", className: "col-xs-12 col-sm-3"},
    {name: "", className: "col-xs-12 col-sm-2"}
];

export const actionsStudentAdmin = [
    {
        title: "Переглянути профіль студента",
        action: "view",
        glyphicon: "glyphicon glyphicon-user",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити профіль студента",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }];

// Subject's config
export const headersSubject = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва предмету", className: "col-xs-12 col-sm-4"},
    {name: "Опис предмету", className: "col-xs-12 col-sm-4"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsSubject = [
    {
        title: "Перейти до тестів", action: "test",
        glyphicon: "glyphicon glyphicon-check", btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Розклад тестів", action: "timeTable",
        style: "glyphicon glyphicon-th", btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати предмет", action: "edit",
        glyphicon: "glyphicon glyphicon-edit", btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити предмет", action: "delete",
        glyphicon: "glyphicon glyphicon-trash", btnClassName: "btn btn-danger btn-sm"
    }
];

// adminUser's configs
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

// Speciality`s configs
export const headersSpeciality = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Код спеціальності", className: "col-xs-12 col-sm-4"},
    {name: "Назва спеціальності", className: "col-xs-12 col-sm-4"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsSpeciality = [
    {
        title: "Перейти до груп спеціальності",
        action: "group",
        glyphicon: "glyphicon glyphicon-th",
        btnClassName: "btn btn-default btn-sm"
    },
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
// end of speciality's configs

// Group's configs
export const headersGroup = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва групи", className: "col-xs-12 col-sm-2"},
    {name: "Факультет", className: "col-xs-12 col-sm-3"},
    {name: "Спеціальність", className: "col-xs-12 col-sm-3"},
    {name: "", className: "col-xs-12 col-sm-3"}
];

export const actionsGroup = [
    {
        title: "Результати тустування групи",
        action: "",
        glyphicon: "glyphicon glyphicon-list-alt",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Переглянути студентів групи",
        action: "",
        glyphicon: "glyphicon glyphicon-user",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Розклад тестування групи",
        action: "",
        glyphicon: "glyphicon glyphicon-calendar",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Редагувати групу",
        action: "edit",
        glyphicon: "glyphicon glyphicon-edit",
        btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити групу",
        action: "delete",
        glyphicon: "glyphicon glyphicon-trash",
        btnClassName: "btn btn-danger btn-sm"
    }
];
// end of Group's configs


export const headersTest = [
    {name: "№", style: "col-xs-12 col-sm-1"},
    {name: "Назва тесту", style: "col-xs-12 col-sm-2"},
    {name: "Завдань", style: "col-xs-12 col-sm-1"},
    {name: "Тривалість", style: "col-xs-12 col-sm-2"},
    {name: "Cпроб", style: "col-xs-12 col-sm-1"},
    {name: "Статус", style: "col-xs-12 col-sm-2"},
    {name: "", style: "col-xs-12 col-sm-3"}
];

export const actionsTest = [
    {
        title: "Детальніше про тест", action: "testDetail",
        style: "glyphicon glyphicon-info-sign", btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Завдання", action: "task",
        glyphicon: "glyphicon glyphicon-tasks", btnClassName: "btn btn-default btn-sm"

    },
    {
        title: "Редагувати тест", action: "edit",
        glyphicon: "glyphicon glyphicon-edit", btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити тест", action: "delete",
        glyphicon: "glyphicon glyphicon-trash", btnClassName: "btn btn-danger btn-sm"
    }
];

export const headersTimeTable = [
    {name: "№", className: "col-xs-12 col-sm-1"},
    {name: "Назва групи", className: "col-xs-12 col-sm-4"},
    {name: "Дата", className: "col-xs-12 col-sm-3"},
    {name: "", className: "col-xs-12 col-sm-4"}
];

export const actionsTimeTable = [
    {
        title: "Редагувати розклад", action: "edit",
        glyphicon: "glyphicon glyphicon-edit", btnClassName: "btn btn-default btn-sm"
    },
    {
        title: "Видалити розклад", action: "delete",
        glyphicon: "glyphicon glyphicon-trash", btnClassName: "btn btn-danger btn-sm"
    }
];

export const headersTestDetail = [
    {name: "№", style: "col-xs-12 col-sm-1"},
    {name: "Рівень", style: "col-xs-12 col-sm-2"},
    {name: "Кількість завдань", style: "col-xs-12 col-sm-3"},
    {name: "Кількість балів", style: "col-xs-12 col-sm-3"},
    {name: "", style: "col-xs-12 col-sm-3"}
];

export const actionsTestDetail = [
    {
        title: "Редагувати параметр", action: "edit",
        style: "glyphicon glyphicon-edit", btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Видалити параметр", action: "delete",
        style: "glyphicon glyphicon-trash", btnStyle: "btn btn-danger btn-sm"
    }
];

export const headersQuestion = [
    {name: "№", style: "col-xs-12 col-sm-1"},
    {name: "Завдання", style: "col-xs-12 col-sm-3"},
    {name: "Рівень", style: "col-xs-12 col-sm-1"},
    {name: "Тип", style: "col-xs-12 col-sm-2"},
    {name: "Вкладення", style: "col-xs-12 col-sm-3"},
    {name: "", style: "col-xs-12 col-sm-2"}
];

export const actionsQuestion = [
    {
        title: "Редагувати завдання", action: "edit",
        style: "glyphicon glyphicon-edit", btnStyle: "btn btn-default btn-sm"
    },
    {
        title: "Видалити завдання", action: "delete",
        style: "glyphicon glyphicon-trash", btnStyle: "btn btn-danger btn-sm"
    }
];
