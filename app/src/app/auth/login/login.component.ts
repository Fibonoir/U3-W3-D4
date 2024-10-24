import { iLoginRequest } from './../auth-interfaces/i-login-request';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  loginForm: FormGroup;

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {

    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  login() {

    if (this.loginForm.valid) {

      const loginData: iLoginRequest = this.loginForm.value;
      this.authSvc.login(loginData).subscribe({
        next: () => {
          alert('Login successful');
          this.router.navigate(['/profile']);
        },
        error: (err: any) => {
          console.error('Login error', err);
          alert('An error occurred during login. Please try again.');
        }
      });
    } else {
      alert('Invalid login info. Please check the form.');
    }
  }
}
