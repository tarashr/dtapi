import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {AuthAdminGuard}  from "./app/shared/services/auth-admin.guard.ts";
import {AuthStudentGuard} from "./app/shared/services/auth-student.guard.ts";
import {LoginComponent}     from "./app/login/login.component";
import {StartPageComponent}  from "./app/studentpart/start-page.component";
import {AdminStartPageComponent} from "./app/admin-start/admin-start-page.component.ts";
import {NotFoundComponent} from "./app/not-found/not-found.component";
import {adminRoutes} from "./app/admin.routing";
import {studentRoutes} from "./app/student.routing";

const appRoutes: Routes = [
    {path: "", redirectTo: "/login", pathMatch: "full"},
    {path: "login", component: LoginComponent},
    {path: "notfound", component: NotFoundComponent},
    {
        path: "student",
        component: StartPageComponent,
        canActivate: [AuthStudentGuard],
        children: studentRoutes
    },
    {
        path: "admin",
        component: AdminStartPageComponent,
        canActivate: [AuthAdminGuard],
        children: adminRoutes
    },
    {path: "**", redirectTo: "/login", pathMatch: "full"}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});