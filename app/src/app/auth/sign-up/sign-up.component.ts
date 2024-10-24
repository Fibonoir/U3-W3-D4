import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { iLoginRequest } from '../auth-interfaces/i-login-request';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  signupForm: FormGroup;

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator as ValidatorFn });
  }

  passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  signup() {
    if (this.signupForm.valid) {
      const signupData: iLoginRequest = this.signupForm.value;
      this.authSvc.register(signupData).subscribe({
        next: () => {
          alert('Signup successful');
          this.router.navigate(['/auth/login']);
        },
        error: (err: any) => {
          console.error('Signup error', err);
          alert('An error occurred during signup. Please try again.');
        }
      });
    } else {
      alert('Invalid signup info. Please check the form.');
    }
  }
}

