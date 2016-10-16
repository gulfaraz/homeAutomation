import {AuthService} from 'aurelia-auth';
import {inject} from 'aurelia-framework';

@inject(AuthService)

export class Login {

    title = "Login";
    userName = "";
    password = "";
    error = "";

    constructor(auth) {
        this.auth = auth;
    }

    login() {
        return this.auth.login({ userName: this.userName, password: this.password })
            .then(response => {
                console.log("Login response: " + response);
            })
            .catch(error => {
                this.error = error.statusText;
            });
    };
}
