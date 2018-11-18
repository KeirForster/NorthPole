import { ValidatorFn } from '@angular/forms';

export class FormControlProperty {
    constructor(
        public propertyName: string,
        public displayName: string,
        public inputType: string,
        public placeholderValue?: string,
        public validators?: ValidatorFn[]
    ) {}
}
