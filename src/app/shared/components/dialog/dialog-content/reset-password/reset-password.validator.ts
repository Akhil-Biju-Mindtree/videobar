import { FormGroup, ValidatorFn, ValidationErrors, FormControl, AbstractControl, Validators } from '@angular/forms';
import { PASSWORD_CONSTANTS } from './reset-password.constant';

export const confirmPasswordValidatior: ValidatorFn = (passwordForm: FormGroup): ValidationErrors | null => {
  const password = passwordForm.get(PASSWORD_CONSTANTS.TEXT.PASSWORD);
  const confirmPassword = passwordForm.get(PASSWORD_CONSTANTS.TEXT.CONFIRM_PASSWORD);
  if (password.invalid || confirmPassword.invalid) {
    return null;
  }
  return password.value !== confirmPassword.value ? { confirmPassword: true } : null;
};

export function validateCustomPattern(regEX: RegExp, patterType: string): ValidatorFn {
  return (passwordControl: AbstractControl): { [key: string]: boolean } | null => {
    return !regEX.test(passwordControl.value) ? { [patterType]: true } : null;
  };
}
