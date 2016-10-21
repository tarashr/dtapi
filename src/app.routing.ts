import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent}     from './app/login/login.component';
import {StartPageComponent}  from './app/studentpart/start-page.component';
import {AdminStartPageComponent} from "./app/statistic/admin-start-page.component";
import {SubjectComponent} from './app/subjects/subject.component';
import {FacultyComponent} from './app/faculty/faculty.component';
import {GroupsOfFacultyComponent} from './app/faculty/groups/groups-of-faculty.component';
import {StatisticComponent} from "./app/statistic/statistic.component";

import {GroupComponent} from './app/group/group.component';
import {SpecialityComponent} from "./app/speciality/speciality.component";

import {AdminUserComponent} from "./app/admin_user/admin-user.component";
import {StudentComponent} from "./app/student/student.component";


const appRoutes:Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'student', component: StartPageComponent},
    {
        path: "admin", component: AdminStartPageComponent,
        children: [
            {path: "", redirectTo: "statistic"},
            {path: "statistic", component: StatisticComponent},
            {path: "subject", component: SubjectComponent},
            {path: "speciality", component: SpecialityComponent},
            {path: "faculty", component: FacultyComponent},
            {path: "faculty/:id/groups", component: GroupsOfFacultyComponent},
            {path: "group", component: GroupComponent},

            {path: "adminUser", component: AdminUserComponent},
            {path: "group", component:GroupComponent},
            {path: "student", component: StudentComponent},
            {path: "**", redirectTo: "statistic", pathMatch: "full"}
        ]
    },
    {path: "**", redirectTo: "login", pathMatch: "full"}
];

export const routing:ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
