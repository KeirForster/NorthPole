import { FormControlProperty } from './../register/form-control-property';
import { ApplicationUser } from './../home/application-user';
import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    OnDestroy,
    TemplateRef
} from '@angular/core';
import {
    FormGroup,
    FormControl,
    AbstractControl,
    Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { faSync, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import {
    emailPattern,
    datePattern,
    latitudePattern,
    longitudePattern,
    postalCodePattern
} from '../register/regex';
import { ActivatedRoute } from '@angular/router';
import { SantaListService } from '../home/santa-list.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
    selector: 'app-child',
    templateUrl: './child.component.html',
    styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit, OnDestroy {
    readonly faSync: any; // loading icon
    readonly faAngleLeft: any; // left arrow icon
    formControlProperties: FormControlProperty[];
    updateForm: FormGroup;
    submitted: boolean;
    updateSuccessMsg: string;
    updateError: string;
    modalRef: BsModalRef;
    private santaSubscription: Subscription;
    private redirectUrl = '/home';
    private model: ApplicationUser;
    @ViewChild('isNaughtyCheckbox') isNaughtyCheckbox: ElementRef;
    @ViewChild('successModal') successModal: TemplateRef<any>;

    constructor(
        private santaService: SantaListService,
        private route: ActivatedRoute,
        private modalService: BsModalService
    ) {
        this.faSync = faSync;
        this.faAngleLeft = faAngleLeft;
        this.formControlProperties = this.setFormControlProperties();
        this.submitted = false;
        this.model = {} as ApplicationUser;
    }

    ngOnInit(): void {
        this.getChild(this.route.snapshot.params.id);
        this.createEmptyForm();
    }

    ngOnDestroy(): void {
        if (this.santaSubscription) {
            this.santaSubscription.unsubscribe();
        }
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    onSubmit(): void {
        if (this.formHasChanges()) {
            this.submitted = true; // disable the form until response
            this.disableFormControls();
            this.santaSubscription = this.santaService
                .updateChild(this.model)
                .subscribe(
                    (res: string) => {
                        this.submitted = false; // disable the form until response
                        this.enableFormControls();
                        this.updateSuccessMsg = res;
                        this.updateForm.reset();
                        this.updateEmptyForm();
                        this.modalRef = this.modalService.show(
                            this.successModal
                        );
                    },
                    error => {
                        this.updateError = error;
                        this.submitted = false; // disable the form until response
                        this.enableFormControls();
                        window.scroll(0, 0);
                    }
                );
        } else {
            this.updateSuccessMsg = undefined;
            this.modalRef = this.modalService.show(this.successModal);
        }
    }

    getRedirectUrl(): string {
        return this.redirectUrl;
    }

    getFormControl(controlName: string): AbstractControl {
        return this.updateForm.get(controlName);
    }

    private formHasChanges(): boolean {
        let hasChange = false;
        if (this.updateForm.dirty) {
            if (this.model.email !== this.updateForm.get('email').value) {
                this.model.email = this.updateForm.get('email').value;
                hasChange = true;
            }
            if (this.model.userName !== this.updateForm.get('userName').value) {
                this.model.userName = this.updateForm.get('userName').value;
                hasChange = true;
            }
            if (
                this.model.firstName !== this.updateForm.get('firstName').value
            ) {
                this.model.firstName = this.updateForm.get('firstName').value;
                hasChange = true;
            }
            if (this.model.lastName !== this.updateForm.get('lastName').value) {
                this.model.lastName = this.updateForm.get('lastName').value;
                hasChange = true;
            }
            if (
                this.model.birthDate !== this.updateForm.get('birthDate').value
            ) {
                this.model.birthDate = this.updateForm.get('birthDate').value;
                hasChange = true;
            }
            if (this.model.street !== this.updateForm.get('street').value) {
                this.model.street = this.updateForm.get('street').value;
                hasChange = true;
            }
            if (this.model.city !== this.updateForm.get('city').value) {
                this.model.city = this.updateForm.get('city').value;
                hasChange = true;
            }
            if (this.model.province !== this.updateForm.get('province').value) {
                this.model.province = this.updateForm.get('province').value;
                hasChange = true;
            }
            if (
                this.model.postalCode !==
                this.updateForm.get('postalCode').value
            ) {
                this.model.postalCode = this.updateForm.get('postalCode').value;
                hasChange = true;
            }
            if (this.model.country !== this.updateForm.get('country').value) {
                this.model.country = this.updateForm.get('country').value;
                hasChange = true;
            }
            if (
                this.model.latitude !== +this.updateForm.get('latitude').value
            ) {
                this.model.latitude = +this.updateForm.get('latitude').value;
                hasChange = true;
            }
            if (
                this.model.longitude !== +this.updateForm.get('longitude').value
            ) {
                this.model.longitude = +this.updateForm.get('longitude').value;
                hasChange = true;
            }
            if (
                this.model.isNaughty !== this.updateForm.get('isNaughty').value
            ) {
                this.model.isNaughty = this.updateForm.get('isNaughty').value;
                hasChange = true;
            }
        }
        return hasChange;
    }

    private getChild(id: string) {
        this.santaSubscription = this.santaService.getChild(id).subscribe(
            (child: ApplicationUser) => {
                console.log(child);
                this.model = child;
                this.updateEmptyForm();

                // set the initial checkbox checked value
                // can't be done via proprty binding
                this.isNaughtyCheckbox.nativeElement.checked;

                this.enableFormControls();
            },
            error => {
                this.updateError = error;
            }
        );
    }

    private enableFormControls(): void {
        for (const prop of this.formControlProperties) {
            const formCtrl = this.updateForm.get(prop.propertyName);

            if (formCtrl) {
                formCtrl.enable();
            }
        }
    }

    private disableFormControls(): void {
        for (const prop of this.formControlProperties) {
            const formCtrl = this.updateForm.get(prop.propertyName);

            if (formCtrl) {
                formCtrl.disable();
            }
        }
    }

    private updateEmptyForm(): void {
        this.updateForm.patchValue({
            email: this.model.email,
            userName: this.model.userName,
            firstName: this.model.firstName,
            lastName: this.model.lastName,
            birthDate: this.formatBirthDate(this.model.birthDate),
            street: this.model.street,
            city: this.model.city,
            province: this.model.province,
            postalCode: this.model.postalCode,
            country: this.model.country,
            latitude: this.model.latitude,
            longitude: this.model.longitude,
            isNaughty: this.model.isNaughty
        });
    }

    private formatBirthDate(timestamp: string): string {
        return timestamp.split('T')[0];
    }

    private createEmptyForm(): void {
        this.updateForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern(emailPattern)
            ]),
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
            isNaughty: new FormControl(null)
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
