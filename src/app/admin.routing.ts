import {Routes, RouterModule} from "@angular/router";
import {SubjectComponent} from "./subjects/subject.component";
import {TestComponent} from "./subjects/tests/test.component";
import {FacultyComponent} from "./faculty/faculty.component";
import {StatisticComponent} from "./statistic/statistic.component";
import {GroupComponent} from "./group/group.component";
import {GroupTimetableComponent} from "./group/group-timetable/group-timetable.component";
import {GroupResultComponent} from "./group/group-result/group-result.component";
import {GroupTestResultComponent} from "./group/group-test-result/group-test-result.component";
import {AdminUserComponent} from "./admin-user/admin-user.component";
import {SpecialityComponent} from "./speciality/speciality.component";
import {StudentComponent} from "./student/student.component";
import {StudentProfileComponent} from "./student/student-profile.component";
import {TimeTableComponent} from "./subjects/timetable/timetable.component";

import { TestDetailComponent } from "./subjects/test-detail/test-detail.component";
import { QuestionComponent } from "./subjects/question/question.component";
import { AnswerComponent } from "./subjects/answer/answer.component";

export const adminRoutes: Routes = [
            {path: "", redirectTo: "statistic"},
            {path: "statistic", component: StatisticComponent},
            {path: "subject", component: SubjectComponent},
            {path: "subject/:id/test", component: TestComponent},
            {path: "subject/test/:id/testDetail", component: TestDetailComponent},
            {path: "subject/test/:id/question", component: QuestionComponent},
            {path: "subject/test/question/:id/answer", component: AnswerComponent},
            {path: "subject/:id/timeTable", component: TimeTableComponent},
            {path: "speciality", component: SpecialityComponent},
            {path: "faculty", component: FacultyComponent},
            {path: "group", component: GroupComponent},
            {path: "group/byFaculty", component: GroupComponent},
            {path: "group/bySpeciality", component: GroupComponent},
            {path: "group/groupTest", component: GroupResultComponent},
            {path: "group/groupTestResult", component: GroupTestResultComponent},
            {path: "group/groupTimetable", component: GroupTimetableComponent},
            {path: "adminUser", component: AdminUserComponent},
            {path: "student", component: StudentComponent},
            {path: "student/byGroup", component: StudentComponent},
            {path: "student/student-profile", component: StudentProfileComponent},
            {path: "student/student-profile/:id", component: StudentProfileComponent},
            {path: "**", redirectTo: "/admin/statistic", pathMatch: "full"}
];