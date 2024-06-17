import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Team } from '../team.model';
import { GameService } from '../game.service';
import { TeamsService } from '../teams.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth/auth-service.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {
  homeTeam: Team | null = null;
  guestTeam: Team | null = null;
  activeTeams: Team[] = [];

  constructor(
    private router: Router,
    private gameService: GameService,
    private teamsService: TeamsService,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Greška',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  onAddTeams() {
    if (this.homeTeam && this.guestTeam && this.homeTeam !== this.guestTeam) {
      console.log('Id igre str tim' + this.gameService.getGame().id);
      console.log(this.gameService.getGame());
      console.log('Domaci vs Gosti', this.homeTeam.name, this.guestTeam.name);

      // const currentHomeTeam = this.gameService.getTeam('home');
      // const currentGuestTeam = this.gameService.getTeam('guest');
      // if (
      //   currentHomeTeam &&
      //   currentHomeTeam.name === this.homeTeam.name &&
      //   currentGuestTeam &&
      //   currentGuestTeam.name === this.guestTeam.name
      // ) {
      //   console.log('Timovi su već postavljeni.');
      // } else {
      console.log(this.homeTeam);
      console.log(this.guestTeam);
      this.gameService.setTeam('home', this.homeTeam);
      this.gameService.setTeam('guest', this.guestTeam);

      this.gameService.updateGame().subscribe();
      // }

      this.router.navigateByUrl('/players-home');
    } else {
      if (!this.homeTeam || !this.guestTeam) {
        this.presentAlert('Morate da izaberete oba tima.');
        console.log('Morate da izaberete oba tima.');
      } else if (this.homeTeam === this.guestTeam) {
        this.presentAlert('Morate da izaberete različite timove.');
        console.log('Morate da izaberete različite timove.');
      }
    }
  }

  ngOnInit() {
    this.teamsService.getActiveTeamsFromDB().subscribe();
    this.teamsService.teams.subscribe((teams) => {
      this.activeTeams = teams;
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl('/log-in');
  }
}
