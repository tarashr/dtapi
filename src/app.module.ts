import {NgModule}                 from "@angular/core";
import {BrowserModule}            from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule}   from "@angular/forms";
import {HttpModule}               from "@angular/http";
import {NgbModule}                from "@ng-bootstrap/ng-bootstrap";
import {ChartModule}              from "angular2-highcharts";
import {routing}                  from "./app.routing";

import {AppComponent}             from "./app/app.component";
import {LoginComponent}           from "./app/login/login.component";
import {StartPageComponent}       from "./app/studentpart/start-page.component";
import {AdminStartPageComponent}  from "./app/admin-start/admin-start-page.component.ts";
import {StatisticComponent}       from "./app/statistic/statistic.component";
import {SubjectComponent}         from "./app/subjects/subject.component";
import {TestComponent}            from "./app/subjects/tests/test.component";
import {TimeTableComponent}       from "./app/subjects/timetable/timetable.component";
import {FacultyComponent}         from "./app/faculty/faculty.component";
import {GroupComponent}           from "./app/group/group.component";
import {GroupTimetableComponent}  from "./app/group/group-timetable/group-timetable.component";
import {GroupResultComponent}     from "./app/group/group-result/group-result.component";
import {GroupTestResultComponent} from "./app/group/group-test-result/group-test-result.component";
import {GroupBarChartResultsComponent} from "./app/group/group-barchart-results/group-barchart-results.component";
import {GroupPieChartResultsComponent} from "./app/group/group-piechart-result/group-piechart-results.component";
import {SpecialityComponent}      from "./app/speciality/speciality.component";
import {AdminUserComponent}       from "./app/admin-user/admin-user.component";
import {StudentComponent}         from "./app/student/student.component";
import {AuthAdminGuard}           from "./app/shared/services/auth-admin.guard.ts";
import {AuthStudentGuard}         from "./app/shared/services/auth-student.guard.ts";
import {LoginService}             from "./app/shared/services/login.service";
import {CRUDService}              from "./app/shared/services/crud.service";
import {SubjectService}           from "./app/shared/services/subject.service";
import {StudentProfileComponent}  from "./app/student/student-profile.component";
import {EntityBarComponent}       from "./app/shared/components/entity-bar/entity-bar.component";
import {TableComponent}           from "./app/shared/components/table/table.component";
import {InfoModalComponent}       from "./app/shared/components/info-modal/info-modal.component";
import {ModalAddEditComponent}    from "./app/shared/components/addeditmodal/modal-add-edit.component";
import {TestDetailComponent}      from "./app/subjects/test-detail/test-detail.component";
import {QuestionComponent}        from "./app/subjects/question/question.component";
import {AnswerComponent}          from "./app/subjects/answer/answer.component";

import {TestsTabsetComponent}     from "./app/studentpart/teststabset/tests-tabset.component";
import {TestPlayerComponent}      from "./app/test-player/test-player.component";
import {UserProfileComponent}     from "./app/studentpart/profile/user-profile.component";
import {GroupService}             from "./app/shared/services/group.service";
import {TestPlayerService}        from "./app/shared/services/test-player.service";
import {TestListComponent}        from "./app/studentpart/test-list/test-list.component";
import {TestListSheduleComponent} from "./app/studentpart/test-list-shedule/test-list-shedule.component";
import {TestBarComponent}         from "./app/shared/components/test-bar/test-bar.component";
import {NgbdAlertSelfclosing}     from "./app/studentpart/alerts/alert.component";
import {CommonService}            from "./app/shared/services/common.service";
import {StudentTestResultsComponent} from "./app/studentpart/test-results/test-results.component";
import {NotFoundComponent}        from "./app/not-found/not-found.component";
import {TestPlayerGuard}          from "./app/shared/services/test-player.guard";
import {LoaderComponent}          from "./app/shared/components/loader/loader.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
        ChartModule,
        routing
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        SubjectComponent,
        StartPageComponent,
        AdminStartPageComponent,
        FacultyComponent,
        StatisticComponent,
        GroupComponent,
        GroupTimetableComponent,
        GroupResultComponent,
        GroupTestResultComponent,
        GroupBarChartResultsComponent,
        GroupPieChartResultsComponent,
        AdminUserComponent,
        SpecialityComponent,
        StudentComponent,
        StudentProfileComponent,
        EntityBarComponent,
        TableComponent,
        InfoModalComponent,
        ModalAddEditComponent,
        TestComponent,
        TestsTabsetComponent,
        TestPlayerComponent,
        UserProfileComponent,
        TimeTableComponent,
        TestDetailComponent,
        QuestionComponent,
        AnswerComponent,
        TestListComponent,
        TestListSheduleComponent,
        TestBarComponent,
        NgbdAlertSelfclosing,
        StudentTestResultsComponent,
        NotFoundComponent,
        LoaderComponent
    ],
    providers: [
        LoginService,
        CRUDService,
        GroupService,
        SubjectService,
        HttpModule,
        AuthAdminGuard,
        AuthStudentGuard,
        TestPlayerGuard,
        TestPlayerService,
        CommonService
    ],
    entryComponents: [ModalAddEditComponent, InfoModalComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
