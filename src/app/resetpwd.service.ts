import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResetpwdService {

  private resetPwdUrl: string;
  constructor(private http: HttpClient) { this.resetPwdUrl = 'http://localhost:8080/private/users/resetpwd'; }

  public resetPwd(user: User, pwd: string)
  {
    return this.http.post<void>(this.resetPwdUrl + "/" + user.id, pwd);
  }
}
