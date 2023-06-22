import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  form!: FormGroup
  response$!: Promise<any>
  loginValue: Login = { userId: '', pw: '' }
  errorMessage: string | null = null;
 
  constructor(private loginSvc: LoginService, private fb:FormBuilder, private router: Router){ }

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: this.fb.control<string>('', [Validators.required]),
      pw: this.fb.control<string>('', [Validators.required])
    })
  }

  process(){
    const result = this.form.value
    this.loginValue.userId = result['userId']
    this.loginValue.pw = result['pw']
    this.response$ = this.loginSvc.checkLogin(this.loginValue)
    .then((response: { status: string; }) => {
      if (response.status === "ID found") {
        console.log("ID found");
        this.router.navigate(['/userhome/'+this.loginValue.userId])
      } else {
        console.log("ID not found");
        this.errorMessage = "User ID or password is incorrect";
      }
    })
    .catch((error: any) => {
      console.error(error);
      this.errorMessage = "Internal error";
    })
  }

}
