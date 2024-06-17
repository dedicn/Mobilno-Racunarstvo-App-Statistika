import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { AlertController, ViewDidEnter } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit, ViewDidEnter {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}
  ionViewDidEnter(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('savedCodeGame');
  }

  isAdmin: boolean = false;
  isLoading = false;

  ngOnInit() {
  }

  onLogIn(logInForm: NgForm) {
    
    console.log(logInForm);
    const role = this.isAdmin ? 'admin' : 'user';
    if (logInForm.valid) {
      this.isLoading = true;
      this.authService.logIn(logInForm.value, role).subscribe({
        next: (resData) => {
          this.isLoading = false;
          localStorage.setItem('token', resData.idToken);
          if (this.isAdmin) {
            this.router.navigateByUrl('/admin-home');
          } else {
            this.router.navigateByUrl('/home');
          }
          logInForm.reset();
        },
        error: async (errRes) => {
          this.isLoading = false;
          let message = 'Netačan email ili lozinka!';

          const alert = await this.alertCtrl.create({
            header: 'Autentifikacija neuspela',
            message,
            buttons: ['Okay'],
          });
          await alert.present();
          logInForm.reset();
        },
      });
    }
  }

  changeToAdmin() {
    this.isAdmin = !this.isAdmin;
  }
}
