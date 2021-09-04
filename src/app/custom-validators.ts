import {AbstractControl, ValidationErrors, FormGroup, ValidatorFn, Validators} from '@angular/forms';

/** Check if values of controls is equals */
export function equalsValidator(controlName1: string, controlName2:string, setControl2Error:boolean = true): ValidatorFn {

  return (formGroup: AbstractControl): ValidationErrors | null => {

    const control1 = formGroup.get(controlName1);
    const control2 = formGroup.get(controlName2);  
    let result = (control1 && control2 && 
                  control1.value && control2.value && 
                  control1.value !== control2.value) ? {notMatch: true } : null;
    if (control2 && setControl2Error && result) control2.setErrors(result);
    return result; 
  };
}


/** Check if value exists in an array  **/
export function existsValidator(values: String[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return values.includes(control.value) ? {existsValue: control.value } : null;
  };
}
