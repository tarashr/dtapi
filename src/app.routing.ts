import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent}     from './app/login/login.component';
import {StartPageComponent}  from './app/studentpart/start-page.component';
import {AdminStartPageComponent} from "./app/statistic/admin-start-page.component";

const appRoutes:Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'student',
        component: StartPageComponent
    },
    {
        path: "admin",
        component: AdminStartPageComponent
    },
    {
        path: "**",
        redirectTo: "login",
        pathMatch: "full"
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
