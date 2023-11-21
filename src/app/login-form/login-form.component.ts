import { Component, HostListener, OnInit } from '@angular/core';
import { AuthenticationDTO } from '../authentication-dto';
import { LoginService } from '../login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit{

  @HostListener('window:beforeunload', ['$event'])
  doLogout($event: Event)
  {
     this.loginService.logout(true).subscribe();
  }
  model: AuthenticationDTO = {email:"", password:""}
  hidden = false;
  rememberMe = false;
  
  constructor(private loginService: LoginService, private cookieService: CookieService){
  }

  ngOnInit(): void {
    this.loginService.menuActive.subscribe({next: (value)=>this.hidden = value});
    setInterval(()=> { if (this.hidden == true) {this.renew(); console.log($localize`renew token`)}}, (4*60  * 1000) );


    if (this.cookieService.check("rememberMe"))
    {
      this.loginService.jwtToken = this.cookieService.get("rememberMe");
      this.loginService.renew().subscribe({next: (res)=>{
        this.loginService.jwtToken=res.jwttoken;
        this.loginService.toggleMenu(true);
        this.loginService.rememberMe().subscribe();
      },
      error: (err: HttpErrorResponse) => { this.cookieService.delete("rememberMe");}
    }
      );
    }
  }
 

  login() {
    if (this.cookieService.check("rememberMe"))
      this.cookieService.delete("rememberMe");
    this.loginService.login(this.model).subscribe({
            next: (res)=>{
              this.model.email= ""; this.model.password ="";this.loginService.toggleMenu(true);
              if (this.rememberMe) this.loginService.rememberMe().subscribe();
            }, 
            error: (err: HttpErrorResponse) =>{window.alert($localize`Wrong user or password`)} });
  };

  renew(){
    this.loginService.renew().subscribe({next: (res)=>{}, error: (err: HttpErrorResponse) => {this.logout()}});
  }

  logout(){
    this.loginService.logout().subscribe();
  }
}