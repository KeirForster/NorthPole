import { Component } from '@angular/core';

import { faSync } from '@fortawesome/free-solid-svg-icons';
import { LoginViewModel } from './login-view-model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    model: LoginViewModel;
    submitted: Boolean;
    faSync = faSync; // loading icon

    constructor() {
        this.model = {} as LoginViewModel;
        this.submitted = false;
    }

    login(): void {
        this.submitted = true;
        console.log(`model: ${this.model}`);
    }
}
