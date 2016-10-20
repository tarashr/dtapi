export class User {
    id?: number;
    email?: string | undefined;
    username: string;
    password: string;
    logins?: string;
    last_login?: string;
    
    constructor(username: string = "", password: string = "", email?: string) {
        this.username = username;
        this.password = password;
        if (email != undefined) {
            this.email = email;
        }
    }
}
