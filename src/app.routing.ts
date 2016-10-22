import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuardAdminService}  from "./app/shared/services/auth-guard-admin.service.ts";
import {AuthGuardStudentService} from "./app/shared/services/auth-guard-student.service.ts";

import {LoginComponent}     from './app/login/login.component';
import {StartPageComponent}  from './app/studentpart/start-page.component';
import {AdminStartPageComponent} from "./app/admin-start/admin-start-page.component.ts";
import {SubjectComponent} from './app/subjects/subject.component';
import {FacultyComponent} from './app/faculty/faculty.component';
import {GroupsOfFacultyComponent} from './app/faculty/groups/groups-of-faculty.component';
import {StatisticComponent} from "./app/statistic/statistic.component";
import {GroupComponent} from './app/group/group.component';
import {AdminUserComponent} from "./app/admin_user/admin-user.component";
import {SpecialityComponent} from "./app/speciality/speciality.component";
import {StudentComponent} from "./app/student/student.component";

const appRoutes:Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'student', component: StartPageComponent, canActivate: [AuthGuardStudentService],},
    {
        path: "admin",
        component: AdminStartPageComponent,
        canActivate: [AuthGuardAdminService],
        children: [
            {path: "", redirectTo: "statistic"},
            {path: "statistic", component: StatisticComponent},
            {path: "subject", component: SubjectComponent},
            {path: "speciality", component: SpecialityComponent},
            {path: "faculty", component: FacultyComponent},
            {path: "group", component: GroupComponent},
            {path: "faculty/:id/groups", component: GroupsOfFacultyComponent},
            {path: "adminUser", component: AdminUserComponent},
            {path: "student", component: StudentComponent},
            {path: "**", redirectTo: "statistic", pathMatch: "full"}
        ]
    },
    {path: "**", redirectTo: "login", pathMatch: "full"}
];

export const routing:ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
