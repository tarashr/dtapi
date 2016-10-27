import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthAdminGuard}  from "./app/shared/services/auth-admin.guard.ts";
import {AuthStudentGuard} from "./app/shared/services/auth-student.guard.ts";

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
import {StudentNewProfileComponent} from "./app/student/student-new-profile.component";
import {StudentProfileComponent} from "./app/student/student-profile.component";

const appRoutes:Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'student', component: StartPageComponent, canActivate: [AuthStudentGuard],},
    {
        path: "admin",
        component: AdminStartPageComponent,
        canActivate: [AuthAdminGuard],
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
            {path: "student-new-profile", component: StudentNewProfileComponent},
            {path: "student-profile", component: StudentProfileComponent},
            {path: "**", redirectTo: "statistic", pathMatch: "full"}
        ]
    },
    {path: "**", redirectTo: "login", pathMatch: "full"}
];

export const routing:ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});