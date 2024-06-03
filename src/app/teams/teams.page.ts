import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Team } from '../team.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {
  home: string = '';
  guest: string = '';

  constructor(private router: Router, private gameService: GameService) {}

  onAddTeams() {
    if (this.home.length >= 3 && this.guest.length >= 3) {
      console.log('Id igre str tim' + this.gameService.getGame().id);
      console.log(this.gameService.getGame());
      console.log('Domaci vs Gosti', this.home, this.guest);
      const homeTeam: Team = { teamID: 'home', name: this.home };
      const guestTeam: Team = { teamID: 'guest', name: this.guest };

      // Proveravamo da li su timovi već postavljeni u gameService
      const currentHomeTeam = this.gameService.getTeam('home');
      const currentGuestTeam = this.gameService.getTeam('guest');

      // Ako su timovi već postavljeni i imaju ista imena kao uneti,
      // ne radimo ništa
      if (
        currentHomeTeam &&
        currentHomeTeam.name === this.home &&
        currentGuestTeam &&
        currentGuestTeam.name === this.guest
      ) {
        console.log('Timovi su već postavljeni.');
      } else {
        if (currentHomeTeam) {
          this.gameService.setTeam('home', homeTeam);
          console.log("home" + this.gameService.getTeam('home'));
        }
        console.log("izmedju");
        if (currentGuestTeam) {
          this.gameService.setTeam('guest', guestTeam);
          console.log('guwst' + this.gameService.getTeam('guest'));
        }

        this.gameService.updateGame().subscribe();
      }

      this.router.navigateByUrl('/players-home');
    } else if (this.home.length <= 3) {
      console.log('Ime domaćina mora da ima više od 3 karaktera');
    } else if (this.guest.length <= 3) {
      console.log('Ime gosta mora da ima više od 3 karaktera');
    }
  }

  ngOnInit() {
    // console.log("Id igre" + this.gameService.getGame().id);
  }
}
