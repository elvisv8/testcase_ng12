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

  /** Data structure description **/
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
     /** add one friend by default **/
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

/** Show dialog window to display results **/
 showResult() {
   const dialogConfig = new MatDialogConfig();
   dialogConfig.data = JSON.stringify(this.userDataForm.value);
   this.dialog.open(DialogInfo, dialogConfig);
 }
}

@Component({
  selector: 'dialog-info-content',
  templateUrl: 'dialog-info-content.html',
})
export class DialogInfo {
  constructor(@Inject(MAT_DIALOG_DATA) public data:string) {}
}
