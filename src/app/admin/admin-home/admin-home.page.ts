import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth-service.service';
import { User } from 'src/app/user.model';


export interface UserSimple {
  id: string;
  email: string;
  token: string;
  role: string;
}

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
})
export class AdminHomePage implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  private user!: boolean;

  ngOnInit() {
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   this.router.navigateByUrl('/log-in');
    //   return;
    // }
    // this.authService.getUserByToken(token).subscribe({
    //   next: (user) => {
    //     if (!user) {
    //       this.router.navigateByUrl('/log-in');
    //       return;
    //     }
    //     this.user = user;
    //   },
    //   error: (error) => {
    //     console.error('Greška pri dobijanju korisnika:', error);
    //     this.router.navigateByUrl('/log-in');
    //   },
    // });
    // this.user = this.authService.isUserAdmin;
    // if(this.user === false){
    //   this.router.navigateByUrl('/log-in');
    //   return;
    // }
    let token = localStorage.getItem("token");
    let isAdmin = localStorage.getItem("isAdmin");

    if(token && isAdmin && isAdmin === "true"){
    //   this.authService.getUserByToken(token).subscribe({
    //     next: (user) => {
    //     if (!user) {
    //       this.router.navigateByUrl('/log-in');
    //       return;
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Greška pri dobijanju korisnika:', error);
    //     this.router.navigateByUrl('/log-in');
    //   },
    // });
    }else{
      this.router.navigateByUrl('/log-in');
      return;
    }
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl('/log-in');
  }

  gotToAdminTeams() {
    this.router.navigateByUrl('/admin-teams');
  }
  gotToAdminPlayers() {
    this.router.navigateByUrl('/admin-players');
  }
  gotToAdminStats() {
    this.router.navigateByUrl('/admin-stats');
  }
}
