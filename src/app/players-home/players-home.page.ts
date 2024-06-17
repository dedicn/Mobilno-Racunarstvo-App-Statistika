import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../players-service.service';
import { Subscription } from 'rxjs';
import { Player } from '../player.model';
import { Team } from '../team.model';
import { GameService } from '../game.service';
import { AlertController } from '@ionic/angular';
import { Game } from '../game.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth-service.service';

@Component({
  selector: 'app-players-home',
  templateUrl: './players-home.page.html',
  styleUrls: ['./players-home.page.scss'],
})
export class PlayersHomePage implements OnInit {
  playersHome: Player[] = [];
  home!: Team;
  isSelectionValid: boolean = false;
  game!: Game;

  constructor(
    private playerService: PlayerService,
    private gameService: GameService,
    private alertController: AlertController,
    private router: Router,
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

  ngOnInit() {
    // this.playerService.playersHome.subscribe((players) => {
    //   this.playersHome = players;
    this.updateSelectionValidity();
    // });

    this.gameService.game.subscribe((game) => {
      this.game = game;
    });

    this.home = this.gameService.getTeam('home');

    if (this.home && this.home.players) {
      if (Array.isArray(this.home.players)) {
        this.playersHome = this.home.players;
      } else {
        const playersObj = this.home.players as unknown;
        if (typeof playersObj === 'object' && playersObj !== null) {
          this.playersHome = Object.keys(playersObj).map(
            (key) => (playersObj as Record<string, Player>)[key]
          );
        }
      }
    } else {
      this.playersHome = [];
    }

    console.log('Domaci  ', this.home);
  }

  onPlayerSelectionChange() {
    this.updateSelectionValidity();
  }

  updateSelectionValidity() {
    const selectedPlayers = this.playersHome.filter(
      (player) => player.selected
    );
    this.isSelectionValid =
      selectedPlayers.length >= 3 && selectedPlayers.length <= 4;
  }

  confirmSelection() {
    if (this.isSelectionValid) {
      console.log(
        'Selected players:',
        this.playersHome.filter((player) => player.selected)
      );
      this.gameService.setTeam('home', this.home);
      this.gameService.updateGame().subscribe();
      this.playerService.setPlayers('home', this.playersHome);
      this.router.navigateByUrl('players-guest');
    } else {
      this.presentAlert('Morate da izaberete minimum 3 a maksimum 4 igraca!');
    }
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl('/log-in');
  }

  ngOnDestroy() {}
}
