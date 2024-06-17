import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PlayerService } from '../players-service.service';
import { Router } from '@angular/router';
import { Player } from '../player.model';
import { GameService } from '../game.service';
import { PlayerStats } from '../player-stats.model';

@Component({
  selector: 'app-player-input-form',
  templateUrl: './player-input-form.component.html',
  styleUrls: ['./player-input-form.component.scss'],
})
export class PlayerInputFormComponent {
  @Input() team: 'home' | 'guest' = 'home';
  @Input() players: Player[] = [];

  constructor(
    private alertController: AlertController,
    private playerService: PlayerService,
    private gameService: GameService,
    private router: Router
  ) {}

  player: Player = {
    id: '',
    name: '',
    surname: '',
    number: null,
    selected: false,
    stats: null,
  };
  maxPlayers: number = 4;

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Greška',
      message: 'Tim mora da čini minimalno 3, a maksimalno 4 igrača!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  onAddPlayer() {
    if (this.players.length < this.maxPlayers) {
      this.playerService.addPlayer(this.team, { ...this.player });
      this.playerService.savePlayerToDB(this.player, this.team).subscribe();

      this.player.name = '';
      this.player.surname = '';
      this.player.number = null;
    } else {
      this.presentAlert();
    }
  }

  onDeletePlayer(playerToDelete: Player) {
    this.playerService.deletePlayer(this.team, playerToDelete);
    this.playerService.deletePlayerFromDB(playerToDelete.id, playerToDelete, this.team).subscribe();
  }

  navigateToPage() {
    if (this.players.length >= 3 && this.players.length <= 4) {
      if (this.team == 'home') {
        this.router.navigateByUrl('players-guest');
      } else {
        //this.playerService.updateAllPlayersInDB().subscribe();
        this.router.navigateByUrl('game');
      }
    } else {
      this.presentAlert();
    }
  }
}
