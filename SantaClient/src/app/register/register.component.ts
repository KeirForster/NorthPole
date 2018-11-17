import { Component } from '@angular/core';

import { faSync } from '@fortawesome/free-solid-svg-icons';
import { RegisterViewModel } from './register-view-model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    model: RegisterViewModel;
    confirmPassword: { [value: string]: string };
    readonly faSync: any; // loading icon
    submitted: boolean;
    registerErrorMsg: string;

    constructor() {
        this.model = {} as RegisterViewModel;
        this.faSync = faSync;
        this.submitted = false;
    }
}
