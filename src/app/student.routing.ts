import {Routes} from "@angular/router";
import {UserProfileComponent} from "./studentpart/profile/user-profile.component";
import {TestPlayerComponent} from "./test-player/test-player.component";
import {TestPlayerGuard} from "./shared/services/test-player.guard";

export const studentRoutes: Routes = [
    {path: "", redirectTo: "profile"},
    {path: "profile", component: UserProfileComponent},
    {path: "test-player", component: TestPlayerComponent, canDeactivate: [TestPlayerGuard]}
];