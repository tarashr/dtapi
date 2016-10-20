import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
import {HttpModule}    from '@angular/http';
import {APP_BASE_HREF} from '@angular/common';
import {NgbModule}     from '@ng-bootstrap/ng-bootstrap';
import {routing}       from "./app.routing";

import {AppComponent}            from './app/app.component';
import {LoginComponent}          from "./app/login/login.component";
import {StartPageComponent}      from "./app/studentpart/start-page.component";
import {AdminStartPageComponent} from "./app/statistic/admin-start-page.component";
import {StatisticComponent} from "./app/statistic/statistic.component";
import {SubjectComponent}        from "./app/subjects/subject.component";
import { AddSubjectComponent }  from './app/subjects/add_subject/add-subject.component';
import { EditSubjectComponent } from './app/subjects/edit_subject/edit-subject.component'
import {FacultyComponent}        from "./app/faculty/faculty.component";
import {NgbdModalBasic}        from "./app/faculty/ngbd-modal-basic.component";
import {GroupComponent}        from './app/group/group.component';


import {SubjectService}      from './app/shared/services/subject.service';
import {LoginService}        from './app/shared/services/login.service';
import {CommonService}       from './app/shared/services/common.service';
import {GroupService}        from './app/shared/services/group.service'
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot(),
        routing
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        SubjectComponent,
        AddSubjectComponent,
        EditSubjectComponent,
        StartPageComponent,
        AdminStartPageComponent,
        FacultyComponent,
        NgbdModalBasic,
        StatisticComponent,
        GroupComponent
    ],
    providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        SubjectService,
        LoginService,
        CommonService,
        GroupService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}