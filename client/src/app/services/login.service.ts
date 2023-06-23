import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Account, Login } from "../models"
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

//const URL = "http://localhost:8080"

@Injectable()
export class LoginService{

    code = uuidv4();

    constructor(private http: HttpClient){ }

    checkLogin(login: Login): Promise<any> {
        const form = new HttpParams().set('userId', login.userId).set('pw', login.pw)
        const headers = new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')

        return firstValueFrom(
            //this.http.post<string>(URL+'/login', form.toString(), { headers })
            this.http.post<string>('/login', form.toString(), { headers })
        )
    }

    verifyDetails(account: Account): Promise<any>{
        const form = new HttpParams().set('userId', account.userId).set('pw', account.pw).set('email', account.email)
        const headers = new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')

        return firstValueFrom(
            //this.http.post<string>(URL+'/verifydetails', form.toString(), { headers })
            this.http.post<string>('/verifydetails', form.toString(), { headers })
        )
    }

    createLogin(account: Account): Promise<any> {
        const form = new HttpParams().set('userId', account.userId).set('pw', account.pw).set('email', account.email)
        const headers = new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')

        return firstValueFrom(
            //this.http.post<string>(URL+'/createaccount', form.toString(), { headers })
            this.http.post<string>('/createaccount', form.toString(), { headers })
        )
    }

    getVerificationCode():any{
        return this.code
    }

    sendCodetoEmail(emailAdd: any):Promise<any>{
        const form = new HttpParams().set('emailAdd', emailAdd).set('code', this.code)
        const headers = new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')

        return firstValueFrom(
            //this.http.post<string>(URL+'/sendCode', form.toString(), { headers })
            this.http.post<string>('/sendCode', form.toString(), { headers })
        )
    }
    
}