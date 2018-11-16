import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
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

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        this.model = {} as LoginViewModel;
        this.faSync = faSync;
        this.submitted = false;
    }

    onSubmit(): void {
        this.submitted = true; // disable the form until response
        this.authService.authenticate(this.model).subscribe(
            (res: string) => {
                this.router.navigate(['/home']); // redirect to home
            },
            error => {
                this.loginError = error; // set the error message
                this.submitted = false; // enable the form
            }
        );
    }
}
