import { AuthService } from './../login/auth.service';
import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormControl,
    AbstractControl,
    Validators
} from '@angular/forms';

import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FormControlProperty } from './form-control-property';
import {
    emailPattern,
    datePattern,
    postalCodePattern,
    latitudePattern,
    longitudePattern
} from './regex';
import { RegisterViewModel } from './register-view-model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    readonly faSync: any; // loading icon
    registerForm: FormGroup;
    model: RegisterViewModel;
    formControlProperties: FormControlProperty[];
    submitted: boolean;
    registerErrorMsg: string;
    errors: any;

    constructor(private authService: AuthService) {
        this.faSync = faSync;
        this.model = {} as RegisterViewModel;
        this.formControlProperties = this.setFormControlProperties();
        this.submitted = false;
    }

    ngOnInit(): void {
        this.authService.logout(); // logout any previously logged-in users
        this.createForm();
    }

    onCheckboxChange(event: any): void {
        this.registerForm.patchValue({
            isNaughty: event.target.checked
        });
    }

    getFormControl(controlName: string): AbstractControl {
        return this.registerForm.get(controlName);
    }

    confirmPasswordDirty(): boolean {
        return this.registerForm.get('confirmPassword').dirty;
    }

    passwordsMatch(): boolean {
        return (
            this.registerForm.get('password').value ===
            this.registerForm.get('confirmPassword').value
        );
    }

    onSubmit(): void {
        this.submitted = true; // disable the form until response
        this.disableFormControls();
        console.warn(this.registerForm);
    }

    private disableFormControls(): void {
        for (const prop of this.formControlProperties) {
            this.registerForm.get(prop.propertyName).disable();
        }
    }

    private createForm(): void {
        this.registerForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern(emailPattern)
            ]),
            password: new FormControl(null, [
                Validators.required,
                Validators.minLength(6)
            ]),
            confirmPassword: new FormControl(null, [Validators.required]),
            userName: new FormControl(null, [Validators.required]),
            firstName: new FormControl(null, [Validators.required]),
            lastName: new FormControl(null, [Validators.required]),
            birthDate: new FormControl(null, [
                Validators.required,
                Validators.pattern(datePattern)
            ]),
            street: new FormControl(null, [Validators.required]),
            city: new FormControl(null, [Validators.required]),
            province: new FormControl(null, [Validators.required]),
            postalCode: new FormControl(null, [
                Validators.required,
                Validators.pattern(postalCodePattern)
            ]),
            country: new FormControl(null, [Validators.required]),
            latitude: new FormControl(null, [
                Validators.required,
                Validators.pattern(latitudePattern)
            ]),
            longitude: new FormControl(null, [
                Validators.required,
                Validators.pattern(longitudePattern)
            ]),
            isNaughty: new FormControl(false)
        });

        // this.registerForm.get('email').disable({ onlySelf: true });
    }

    private setFormControlProperties(): FormControlProperty[] {
        return [
            {
                propertyName: 'email',
                displayName: 'Email',
                inputType: 'email',
                placeholderValue: 'coolkid197@gmail.com'
            } as FormControlProperty,
            {
                propertyName: 'password',
                displayName: 'Password',
                inputType: 'password'
            } as FormControlProperty,
            {
                propertyName: 'confirmPassword',
                displayName: 'Confirm Password',
                inputType: 'password'
            } as FormControlProperty,
            {
                propertyName: 'userName',
                displayName: 'Username',
                inputType: 'text',
                placeholderValue: 'coolkenny177'
            } as FormControlProperty,
            {
                propertyName: 'firstName',
                displayName: 'First Name',
                inputType: 'text',
                placeholderValue: 'Kenny'
            } as FormControlProperty,
            {
                propertyName: 'lastName',
                displayName: 'Last Name',
                inputType: 'text',
                placeholderValue: 'Coolerson'
            } as FormControlProperty,
            {
                propertyName: 'birthDate',
                displayName: 'Birthdate',
                inputType: 'date',
                placeholderValue: 'Coolerson'
            } as FormControlProperty,
            {
                propertyName: 'street',
                displayName: 'Street',
                inputType: 'text',
                placeholderValue: '101 First St'
            } as FormControlProperty,
            {
                propertyName: 'city',
                displayName: 'City',
                inputType: 'text',
                placeholderValue: 'Winnipeg'
            } as FormControlProperty,
            {
                propertyName: 'province',
                displayName: 'Province',
                inputType: 'text',
                placeholderValue: 'Manitoba'
            } as FormControlProperty,
            {
                propertyName: 'postalCode',
                displayName: 'Postal Code',
                inputType: 'text',
                placeholderValue: 'V5G 3H2'
            } as FormControlProperty,
            {
                propertyName: 'country',
                displayName: 'Country',
                inputType: 'text',
                placeholderValue: 'Canada'
            } as FormControlProperty,
            {
                propertyName: 'latitude',
                displayName: 'Latitude',
                inputType: 'number',
                placeholderValue: '49.25'
            } as FormControlProperty,
            {
                propertyName: 'longitude',
                displayName: 'Longitude',
                inputType: 'number',
                placeholderValue: '122.99'
            } as FormControlProperty,
            {
                propertyName: 'isNaughty',
                inputType: 'checkbox'
            } as FormControlProperty
        ];
    }
}
