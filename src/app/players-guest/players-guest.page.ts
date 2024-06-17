import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../players-service.service';
import { Player } from '../player.model';
import { GameService } from '../game.service';
import { AlertController } from '@ionic/angular';
import { Team } from '../team.model';
import { Game } from '../game.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth-service.service';

@Component({
  selector: 'app-players-guest',
  templateUrl: './players-guest.page.html',
  styleUrls: ['./players-guest.page.scss'],
})
export class PlayersGuestPage implements OnInit {
  playersGuest: Player[] = [];
  guest!: Team;
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
    // this.playerService.playersGuest.subscribe((players) => {
    //   this.playersGuest = players;
    this.updateSelectionValidity();
    // });

    console.log(this.playersGuest);

    this.gameService.game.subscribe((game) => {
      this.game = game;
    });

    this.guest = this.gameService.getTeam('guest');

    if (this.guest && this.guest.players) {
      if (Array.isArray(this.guest.players)) {
        this.playersGuest = this.guest.players;
      } else {
        const playersObj = this.guest.players as unknown;
        if (typeof playersObj === 'object' && playersObj !== null) {
          this.playersGuest = Object.keys(playersObj).map(
            (key) => (playersObj as Record<string, Player>)[key]
          );
        }
      }
    } else {
      this.playersGuest = [];
    }

    console.log('Gost  ', this.guest);
  }

  onPlayerSelectionChange() {
    this.updateSelectionValidity();
  }

  updateSelectionValidity() {
    const selectedPlayers = this.playersGuest.filter(
      (player) => player.selected
    );
    this.isSelectionValid =
      selectedPlayers.length >= 3 && selectedPlayers.length <= 4;
  }

  confirmSelection() {
    if (this.isSelectionValid) {
      console.log(
        'Selected players:',
        this.playersGuest.filter((player) => player.selected)
      );
      this.gameService.setTeam('guest', this.guest);
      this.gameService.updateGame().subscribe();
      this.playerService.setPlayers('guest', this.playersGuest);
      this.router.navigateByUrl('/game');
    } else {
      this.presentAlert('Morate da izaberete minimum 3 a maksimum 4 igraca!');
    }
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl('/log-in');
  }
}
