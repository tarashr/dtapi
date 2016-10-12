import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { routing } from "./app.routing";

import { AppComponent }  from './app/app.component';
import { LoginComponent } from "./app/login/login.component";
import { StartPageComponent } from "./app/studentpart/start-page.component";
import { AdminStartPageComponent } from "./app/statistic/admin-start-page.component";
import { SubjectComponent } from "./app/subjects/subject.component";
import { FacultyComponent } from "./app/faculty/faculty.component";


import { SubjectService }          from './app/shared/services/subject.service';
import { LoginService }        from './app/shared/services/login.service';
import { CommonService }        from './app/shared/services/common.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        SubjectComponent,
        StartPageComponent,
        AdminStartPageComponent,
        FacultyComponent
    ],
    providers:[
        {provide: APP_BASE_HREF, useValue: '/'},
        SubjectService,
        LoginService,
        CommonService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }