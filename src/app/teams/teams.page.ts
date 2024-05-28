import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {
  home: string = '';
  guest: string = '';

  constructor(private router: Router) {}

  onAddTeams() {
    //TODO: ovde treba u bazu da se unese imena timova za utakmicu sa prethodno unetim kodom
    if (this.home.length >= 3 && this.guest.length >= 3) {
      console.log('Domaci vs Gosti', this.home, this.guest);
      this.router.navigateByUrl('/players');
    } else if (this.home.length <= 3) {
      console.log('Ime domacina mora da ima vise od 3 karaktera');
    } else if (this.guest.length <= 3) {
      console.log('Ime gosta mora da ima vise od 3 karaktera');
    }
  }

  ngOnInit() {}
}
