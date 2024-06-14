import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  isAdmin: boolean = false;

  ngOnInit() {}

  onLogIn(logInForm: NgForm) {
    console.log(logInForm);
    const role = this.isAdmin ? "admin" : "user";
    if (logInForm.valid) {
      this.authService.logIn(logInForm.value, role).subscribe({
        next: (resData) => {
          if(this.isAdmin){
            //TODO: dodaj da se cuva u localstorage-u
            this.router.navigateByUrl('/quotes/tabs/explore');
          }else{
            this.router.navigateByUrl('/home');
          }
          
        },
        error: async (errRes) => {
          let message = 'Netačan email ili lozinka!';

          // const code = errRes.error.error.message;
          // if (code === 'EMAIL_NOT_FOUND') {
          //     message = 'Email address could not be found.';
          // } else if (code === 'INVALID_PASSWORD') {
          //     message = 'This password is not correct.';
          // }

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

  changeToAdmin(){
    this.isAdmin = !this.isAdmin;
  }
}
