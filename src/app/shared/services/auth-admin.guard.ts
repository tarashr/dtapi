import {Injectable}     from "@angular/core";
import {CanActivate, Router}    from "@angular/router";

@Injectable()
export class AuthAdminGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(): boolean {
        return this.checkLogin();
    }

    checkLogin(): boolean {
        if (sessionStorage.getItem("userRole") === "admin") return true;
        this.router.navigate(["/notfound"]);
        return false;
    }
}