import { AuthService } from './../login/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    FormGroup,
    FormControl,
    AbstractControl,
    Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { faSync, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FormControlProperty } from './form-control-property';
import {
    emailPattern,
    datePattern,
    latitudePattern,
    longitudePattern,
    postalCodePattern
} from './regex';
import { RegisterService } from './register.service';
import { RegisterViewModel } from './register-view-model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
    readonly faSync: any; // loading icon
    readonly faAngleLeft: any; // left arrow icon
    registerForm: FormGroup;
    model: RegisterViewModel;
    formControlProperties: FormControlProperty[];
    submitted: boolean;
    registerError: string;
    private regSubscription: Subscription;
    private redirectUrl = '/login';

    constructor(
        private authService: AuthService,
        private regService: RegisterService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.faSync = faSync;
        this.faAngleLeft = faAngleLeft;
        this.model = {} as RegisterViewModel;
        this.formControlProperties = this.setFormControlProperties();
        this.submitted = false;
    }

    ngOnInit(): void {
        // route data passed
        if (this.route.snapshot.data.redirectUrl) {
            // update redirect url
            this.redirectUrl = this.route.snapshot.data.redirectUrl;
        } else {
            // logout any previously logged-in users
            this.authService.logout();
        }
        this.createForm();
    }

    ngOnDestroy(): void {
        if (this.regSubscription) {
            this.regSubscription.unsubscribe();
        }
    }

    getRedirectUrl(): string {
        return this.redirectUrl;
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
        this.setModelValues();
        this.regSubscription = this.regService.register(this.model).subscribe(
            (res: string) => {
                this.router.navigate([this.redirectUrl]);
            },
            error => {
                this.registerError = error;
                this.submitted = false;
                this.enableFormControls();
                window.scroll(0, 0);
            }
        );
    }

    private setModelValues(): void {
        for (const prop of this.formControlProperties) {
            // confirm password not included
            if (prop.propertyName !== 'confirmPassword') {
                let value = this.registerForm.get(prop.propertyName).value;

                // parse numbers
                if (prop.inputType === 'number') {
                    value = +value;
                }
                this.model[prop.propertyName] = value;
            }
        }
    }

    private disableFormControls(): void {
        for (const prop of this.formControlProperties) {
            this.registerForm.get(prop.propertyName).disable();
        }
    }

    private enableFormControls(): void {
        for (const prop of this.formControlProperties) {
            this.registerForm.get(prop.propertyName).enable();
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
