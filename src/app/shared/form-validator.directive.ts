import {Directive, forwardRef, Attribute} from '@angular/core';
import {Validator, AbstractControl, NG_VALIDATORS, FormControl} from '@angular/forms';

@Directive({
    selector: '[validateForm][formControlName],[validateForm][formControl],[validateForm][ngModel]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => FormValidator), multi: true}
    ]
})

export class FormValidator implements Validator {
    constructor(@Attribute('validateForm') public validateForm: string) {
    }

    validate(c: AbstractControl): { [key: string]: any } {
        // self value (e.g. retype password)
        let v = c.value;

        // control value (e.g. password)
        let e = c.root.get(this.validateForm);

        // value not equal
        if (e && v !== e.value) return {
            validateForm: false
        }
        return null;
    }
}
