import { Component, Input, OnInit } from '@angular/core';
import { User } from '../user';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetpwdService } from '../resetpwd.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-pwd-form',
  templateUrl: './reset-pwd-form.component.html',
  styleUrls: ['./reset-pwd-form.component.css'],
})

export class ResetPwdFormComponent implements OnInit {
  newPwd = new FormControl('');
  @Input() user?: User;
   ngOnInit(): void {
    this.user = window.history.state;
  }
  constructor(private resetpwdService: ResetpwdService, private router: Router){
  }

  onSubmit() {
    if (typeof this.user !== 'undefined') {
        this.resetpwdService.resetPwd(this.user, ""+this.newPwd.value).subscribe({
                                                                        next: (data)=>this.router.navigate(['/users']),
                                                                        error: (err: HttpErrorResponse) => {
                                                                          if (err.status == 403)
                                                                            window.alert($localize`"Your user don't have the role to exectue this operation`);
                                                                          }
                                                                        });
    }
  }
}