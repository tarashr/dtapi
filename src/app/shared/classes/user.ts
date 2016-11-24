export class User {
    id?: number;
    email?: string | undefined;
    username: string;
    password: string;
    password_confirm?: string;

    constructor(username: string = "", email?: string, password: string = "", password_confirm?: string) {
        this.username = username;
        this.password = password;
        this.password_confirm = password_confirm;
        if (email != undefined) {
            this.email = email;
        }
    }
}
