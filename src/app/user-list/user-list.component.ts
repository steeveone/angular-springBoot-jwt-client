import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit{

  users: User[]| undefined;
  constructor(private userService: UserService,
              private loginService: LoginService) {
  }

  ngOnInit() {
    if (this.loginService.isLoggedIn())
    this.userService.findAll().subscribe(
      {
        next: (data) => {this.users = data;}, 
        error: (error: HttpErrorResponse) => {if (error.status==403) window.alert($localize`Your user don't have the role to execute this operation`); else this.loginService.logout().subscribe()}
      });
  }

  delete(user:User )
  {
    this.userService.delete(user).subscribe({next: (data) =>{ this.gotoUserList()},
                                            error: (error: HttpErrorResponse) => { if (error.status==401){this.loginService.logout().subscribe()}}});
  }

  gotoUserList() {
    this.ngOnInit();
  }
}
