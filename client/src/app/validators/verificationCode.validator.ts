import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { LoginService } from '../services/login.service';

export function matchSystemValueValidator(loginService: LoginService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const codeValue = control.value;
    const matchingValue = loginService.getVerificationCode();
    console.log(matchingValue)
    const isMatch = codeValue === matchingValue;

    if (!isMatch) {
      return { matchSystemValue: { message: 'Verification code is not correct.' } };
    }

    return null; 
    
  };
}
