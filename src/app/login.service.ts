import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, finalize, map, takeUntil, tap } from 'rxjs';
import { AuthenticationDTO } from './authentication-dto';
import { JwtToken } from './jwt-token';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  
  private loginUrl: string;
  jwtToken: string;
  private loggedIn = false;

  constructor(private http: HttpClient, 
    private cookieService: CookieService) {
    this.jwtToken = "";
    this.loginUrl = 'http://localhost:8080/public/authentication';
  }
   
  public login(dto: AuthenticationDTO )
  { 
    this.cookieService.delete("rememberMe");
    return this.http.post<JwtToken>(this.loginUrl + "/login", dto).pipe(tap(_ => {this.jwtToken = _.jwttoken; this.loggedIn = true;}));
  }

  public renew()
  { 
    return this.http.get<JwtToken>(this.loginUrl + "/renew").pipe(tap(_ => { this.jwtToken = _.jwttoken;this.loggedIn = true; } ));
  }

  public logout(rememberMe? : boolean)
  {
    let doPost = false;
    if (rememberMe == null) doPost = true;
    if (rememberMe != null && rememberMe == false) doPost = true;

    if (this.cookieService.check("rememberMe") && doPost)
    {
      return this.http.post<void>(this.loginUrl + "/logout", this.cookieService.get("rememberMe")).pipe(map(res=>{}), finalize(()=>{
        this.loggedIn = false;
        this.jwtToken = "";
        this.toggleMenu(false);
        this.cookieService.delete("rememberMe");
      }));
    }
    else
    return this.http.get<void>(this.loginUrl + "/logout").pipe(map(res=>{}), finalize(()=>{
      this.loggedIn = false;
      this.jwtToken = "";
      this.toggleMenu(false);
      this.cookieService.delete("rememberMe");
    }));
  }

  public rememberMe()
  {
    return this.http.get<JwtToken>(this.loginUrl + "/rememberMe").pipe(tap(_=> 
      {
        const myDate: Date = new Date();
        myDate.setTime(myDate.getTime() + 86400000 *5);
        this.cookieService.set("rememberMe", _.jwttoken, myDate);
      }
      ));
  }

  public menuSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);
  public menuActive = this.menuSubject.asObservable();
  public toggleMenu(val : boolean) {
      this.menuSubject.next(val);
  }

  public isLoggedIn()
  {
    return this.loggedIn;
  }

}
