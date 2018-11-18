import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class LoginComponent implements OnInit, OnDestroy {
    readonly faSync: any; // loading icon
    model: LoginViewModel;
    submitted: boolean;
    loginError: string;
    private authSubscription: Subscription;

    constructor(private router: Router, private authService: AuthService) {
        this.faSync = faSync;
        this.model = {} as LoginViewModel;
        this.submitted = false;
    }

    ngOnInit(): void {
        this.authService.logout(); // logout any previously logged-in users
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
