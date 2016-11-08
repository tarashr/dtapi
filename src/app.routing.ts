import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {AuthAdminGuard}  from "./app/shared/services/auth-admin.guard.ts";
import {AuthStudentGuard} from "./app/shared/services/auth-student.guard.ts";
import {LoginComponent}     from "./app/login/login.component";
import {StartPageComponent}  from "./app/studentpart/start-page.component";
import {AdminStartPageComponent} from "./app/admin-start/admin-start-page.component.ts";
import {SubjectComponent} from "./app/subjects/subject.component";
import {TestComponent} from "./app/subjects/tests/test.component";
import {FacultyComponent} from "./app/faculty/faculty.component";
import {StatisticComponent} from "./app/statistic/statistic.component";
import {GroupComponent} from "./app/group/group.component";
import {GroupTimetableComponent} from "./app/group/group-timetable/group-timetable.component";
import {AdminUserComponent} from "./app/admin-user/admin-user.component";
import {SpecialityComponent} from "./app/speciality/speciality.component";
import {StudentComponent} from "./app/student/student.component";
import {StudentNewProfileComponent} from "./app/student/student-new-profile.component";
import {StudentProfileComponent} from "./app/student/student-profile.component";
import {TimeTableComponent} from "./app/subjects/timetable/timetable.component";

import { TestDetailComponent } from "./app/subjects/test-detail/test-detail.component";
import { QuestionComponent } from "./app/subjects/question/question.component";

import {UserProfileComponent} from "./app/studentpart/profile/user-profile.component";
import {TestPlayerComponent} from "./app/test-player/test-player.component";
import {TestDetail} from "./app/shared/classes/test-detail";

const appRoutes: Routes = [
    {path: "", redirectTo: "login", pathMatch: "full"},
    {path: "login", component: LoginComponent},
    {
        path: "student",
        component: StartPageComponent,
        canActivate: [AuthStudentGuard],
        children: [
            {path: "", redirectTo: "profile"},
            {path: "profile", component: UserProfileComponent},
            {path: "test-player", component: TestPlayerComponent}
        ]
    },
    {
        path: "admin",
        component: AdminStartPageComponent,
        canActivate: [AuthAdminGuard],
        children: [
            {path: "", redirectTo: "statistic"},
            {path: "statistic", component: StatisticComponent},
            {path: "subject", component: SubjectComponent},
            {path: "subject/:id/test", component: TestComponent},
            {path: "subject/test/:id/testDetail", component: TestDetailComponent},
            {path: "subject/test/:id/question", component: QuestionComponent},
            {path: "subject/:id/timeTable", component: TimeTableComponent},
            {path: "speciality", component: SpecialityComponent},
            {path: "faculty", component: FacultyComponent},
            {path: "group", component: GroupComponent},
            {path: "group/groupTimetable", component: GroupTimetableComponent},
            {path: "faculty/:id/groups", component: GroupComponent},
            {path: "adminUser", component: AdminUserComponent},
            {path: "student", component: StudentComponent},
            {path: "student/student-new-profile", component: StudentNewProfileComponent},
            {path: "student/student-profile/:id", component: StudentProfileComponent},
            {path: "**", redirectTo: "statistic", pathMatch: "full"}
        ]
    },
    {path: "**", redirectTo: "login", pathMatch: "full"}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});