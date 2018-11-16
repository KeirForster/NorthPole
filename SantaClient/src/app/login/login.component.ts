import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthenticateService } from './authenticate.service';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { LoginViewModel } from './login-view-model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    model: LoginViewModel;
    readonly faSync: any; // loading icon
    submitted: boolean;
    loginError: string;

    constructor(private authService: AuthenticateService) {
        this.model = {} as LoginViewModel;
        this.faSync = faSync;
        this.submitted = false;
    }

    onSubmit(): void {
        console.log(`model: ${JSON.stringify(this.model)}`);
        this.submitted = true;
        this.loginError = undefined; // remove any previous login errors
        this.authService.authenticate(this.model).subscribe(
            (user: string) => {
                console.log(user);
            },
            error => {
                this.loginError = error; // set the error message
                this.submitted = false; // reset the form
            }
        );
    }
}
