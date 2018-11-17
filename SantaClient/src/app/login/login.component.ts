import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { LoginViewModel } from './login-view-model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
    private authSubscription: Subscription;
    model: LoginViewModel;
    readonly faSync: any; // loading icon
    submitted: boolean;
    loginError: string;

    constructor(private router: Router, private authService: AuthService) {
        this.authService.logout(); // logout any previously logged-in users
        this.model = {} as LoginViewModel;
        this.faSync = faSync;
        this.submitted = false;
    }

    ngOnDestroy(): void {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }

    onSubmit(): void {
        this.submitted = true; // disable the form until response
        this.authSubscription = this.authService
            .authenticate(this.model)
            .subscribe(
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
