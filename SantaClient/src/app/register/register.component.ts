import { AuthService } from './../login/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';

import { faSync } from '@fortawesome/free-solid-svg-icons';
import { RegisterViewModel } from './register-view-model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    model: RegisterViewModel;
    confirmPassword: { [key: string]: string };
    readonly faSync: any; // loading icon
    submitted: boolean;
    registerErrorMsg: string;
    registerForm: NgForm;

    constructor(private authService: AuthService) {
        this.authService.logout(); // logout any previously logged-in users
        this.model = {} as RegisterViewModel;
        this.faSync = faSync;
        this.submitted = false;
    }

    ngOnInit(): void {
        // code here
    }
}
