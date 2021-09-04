import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { equalsValidator, existsValidator } from './custom-validators';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'testcase',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  userDataForm: FormGroup = this.fb.group ({
      name: ['', [ Validators.required,]],
      email: ['', [ Validators.required, Validators.email, existsValidator(['testas@testas.lt']) ]],
      password: ['', [Validators.required]],
      retryPassword: ['',[Validators.required]],
      friends: this.fb.array([],[Validators.required])          
    }, 
    { validators: equalsValidator('password','retryPassword')});

 
  constructor(private fb: FormBuilder, public dialog: MatDialog){}

  ngOnInit() {
     /* add one friend by default */
      this.addFriend();
  }

/** Operations with friends (get, add, delete) **/
  get friends() {
     return this.userDataForm.get("friends") as FormArray;
  }

  addFriend() {
     const friendDataForm = this.fb.group({
         name: ['', [ Validators.required,]],
         email: ['', [ Validators.required, Validators.email ]]
     });

     this.friends.push(friendDataForm);
  }

  deleteFriend(idx: number) {
     this.friends.removeAt(idx);
  }
/**********************************/

/** Is control has specific error? **/
 ctrlHasError(form: AbstractControl, controlName: string, errorName: string) {
    const control = form.get(controlName);
    return (control && control.hasError(errorName));
 }

 showResult() {
   const dialogConfig = new MatDialogConfig();
   dialogConfig.data = JSON.stringify(this.userDataForm.value);
   this.dialog.open(DialogInfo, dialogConfig);
 }


 getFormErrors(form: AbstractControl | null) {
    if (form instanceof FormControl) {
        // Return FormControl errors or null
        return form.errors ?? null;
    }
    if (form instanceof FormGroup) {
        const groupErrors = form.errors;
        // Form group can contain errors itself, in that case add'em
        const formErrors:  { [key: string]: any } = groupErrors ? {groupErrors} : {};
        Object.keys(form.controls).forEach(key => {
           const error = this.getFormErrors(form.get(key));
           if (error !== null) {
                formErrors[key] = error;
           }
        });
        return Object.keys(formErrors).length > 0 ? formErrors : null;
    }
    return null;
}

}

@Component({
  selector: 'dialog-info-content',
  templateUrl: 'dialog-info-content.html',
})
export class DialogInfo {
  constructor(@Inject(MAT_DIALOG_DATA) public data:string) {}
}
