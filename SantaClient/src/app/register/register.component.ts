import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { faSync } from '@fortawesome/free-solid-svg-icons';
import { RegisterViewModel } from './register-view-model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    model: RegisterViewModel;
    confirmPassword: { [value: string]: string };
    readonly faSync: any; // loading icon
    submitted: boolean;
    registerErrorMsg: string;
    registerForm: NgForm;

    constructor() {
        this.model = {} as RegisterViewModel;
        this.faSync = faSync;
        this.submitted = false;
    }

    ngOnInit(): void {
        // code here
    }
}
