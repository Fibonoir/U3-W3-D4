import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { iAccessData } from './auth-interfaces/i-access-data';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { iUser } from './auth-interfaces/i-user';
import { iLoginRequest } from './auth-interfaces/i-login-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper:JwtHelperService = new JwtHelperService()
  private signUpUrl:string = environment.signUpUrl
  private loginUrl:string = environment.loginUrl

  private authSubject$ = new BehaviorSubject<iAccessData | null>(null)
  private isLoggedIn$ = this.authSubject$.pipe(
    map(accessData => !!accessData)
  )
  private isLoggedIn:boolean = false
  user$ = this.authSubject$.asObservable().pipe(
    tap(accessData => this.isLoggedIn == !!accessData),
    map(accesData => accesData?.user)
  )

  private autoLogoutTimer:any


  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.restoreUser()
  }



  register(newUser:Partial<iUser>){
    return this.http.post<iAccessData>(this.signUpUrl, newUser)
  }

  login(authData:iLoginRequest){
    return this.http.post<iAccessData>(this.loginUrl, authData)
    .pipe(
      tap(accessData => {
        this.authSubject$.next(accessData)
        localStorage.setItem("accessData", JSON.stringify(accessData))

        const expDate = this.jwtHelper.getTokenExpirationDate(accessData.token)
        if(!expDate) return

        this.autoLogout(expDate)
      }
    ))
  }

  logout(){
    this.authSubject$.next(null)
    localStorage.removeItem("accessData")
    this.router.navigate(["/auth/login"])
  }

  autoLogout(expDate:Date){
    const expMs = expDate.getTime() -new Date().getTime()

    this.autoLogoutTimer =setTimeout(() => {
      this.logout()
    }, expMs)

  }

  restoreUser(){
    const userJson:string|null = localStorage.getItem("accessData")
    if(!userJson) return

    const accessData:iAccessData = JSON.parse(userJson)

    if(this.jwtHelper.isTokenExpired(accessData.token)){
      localStorage.removeItem("accessData")
      return
    }

    this.authSubject$.next(accessData)
  }
}
