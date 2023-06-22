import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/models';
import { LoginService } from 'src/app/services/login.service';
import { matchSystemValueValidator } from 'src/app/validators/verificationCode.validator';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  form!: FormGroup
  response$!: Promise<any>
  accountDetails: Account = { userId: '', pw: '', email: '' }
  message!: string
  duplicationCheck!: string
  codeSendResult!: string
  
  constructor(private loginSvc: LoginService, private fb:FormBuilder, private router:Router){ }

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: this.fb.control<string>('',[Validators.required]),
      pw: this.fb.control<string>('', [Validators.required]),
      confirmPw: this.fb.control<string>('', [Validators.required]),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      code: this.fb.control<string>('', [Validators.required, matchSystemValueValidator(this.loginSvc)])
    });
    this.form.setValidators(this.checkPasswords);
  }

  checkPasswords(control: AbstractControl): { [key: string]: boolean } | null {
    const group = control as FormGroup;
    const pass = group.controls['pw'].value;
    const confirmPass = group.controls['confirmPw'].value;
  
    return pass === confirmPass ? null : { notSame: true }  
  }

  sendCode(){
    const emailAdd = this.form.value['email']
    this.response$ = this.loginSvc.sendCodetoEmail(emailAdd)
    .then((response: { status: string; }) => {
        if (response.status === "Code sent successfully!") {
         this.codeSendResult = "Code sent successfully!";
        } else {
          this.codeSendResult = "Not able to send code, please check email address and try again";
        }
      })
      .catch((error: any) => {
        console.error(error);
      })
  }

  verifyDetails(){
    const result = this.form.value
    this.accountDetails.userId = result['userId']
    this.accountDetails.pw = result['pw']
    this.accountDetails.email = result['email']
    this.response$ = this.loginSvc.verifyDetails(this.accountDetails)
    .then((response: { status: string; }) => {
      this.duplicationCheck = response.status
    })
    .catch((error: any) => {
      console.error(error);
    })
  }

  process(){
    const result = this.form.value
    this.accountDetails.userId = result['userId']
    this.accountDetails.pw = result['pw']
    this.accountDetails.email = result['email']
    this.response$ = this.loginSvc.createLogin(this.accountDetails)
    .then((response: { status: string; }) => {
      this.message = response.status
      if(this.message == 'Account created successfully'){
        this.form.reset();
        setTimeout(() => this.router.navigate(['/createaccount']), 1500);
      }
    })
    .catch((error: any) => {
      console.error(error);
    })
  }

}
