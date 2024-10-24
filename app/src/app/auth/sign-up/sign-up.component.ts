import { Component } from '@angular/core';
import { iUser } from '../auth-interfaces/i-user';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  formData: Partial<iUser> = {}

  constructor(
    private authSvc: AuthService,
    private router: Router
  ){}

  register(){
    this.authSvc.register(this.formData)
    .subscribe(res => {
      this.router.navigate(['/auth/login'])
    })
  }
}
