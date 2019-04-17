import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { DialogData } from './login-dialog/DialogData';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'header-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  public dialogWithForm: MatDialogRef<LoginDialogComponent, DialogData>;
  public email: string;
  public password: string;
  public isLoggedIn: boolean;

  constructor(private dialog: MatDialog,
              public authService: AuthService) {
                
    this.isLoggedIn = authService.isLoggedIn();
    console.log(`login - ${this.isLoggedIn}`);
  }

  public ngOnInit(): void {
  }

  public logout(): void {
    this.authService.logout();
  }

  public dialogForm(): void {
 
    this.dialogWithForm = this.dialog
    .open(LoginDialogComponent, {
      data: { email: this.email, password: this.password }
    });
    
    this.dialogWithForm.afterClosed()
    .subscribe((result:DialogData) => {
      console.log(this.dialogWithForm);
      if (result) {
        this.email = result.email;
        this.password = result.password;
      }
    });
  }
}
