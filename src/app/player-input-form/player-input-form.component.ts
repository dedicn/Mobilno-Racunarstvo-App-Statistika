import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PlayerService } from '../players-service.service';
import { Router } from '@angular/router';

interface Player {
  name: string;
  surname: string;
  number: number | null;
}

@Component({
  selector: 'app-player-input-form',
  templateUrl: './player-input-form.component.html',
  styleUrls: ['./player-input-form.component.scss'],
})
export class PlayerInputFormComponent {
  @Input() team: 'home' | 'guest' = 'home';
  @Input() players: Player[] = [];
  // @Output() playersChange = new EventEmitter<Player[]>();

  constructor(
    private alertController: AlertController,
    private playerService: PlayerService,
    private router: Router
  ) {}

  player: Player = {
    name: '',
    surname: '',
    number: null,
  };
  maxPlayers: number = 4;

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Greška',
      message: 'Tim može da čini maksimalno 4 igrača!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  onAddPlayer() {
    if (this.players.length < this.maxPlayers) {
      // this.players.push({ ...this.player });
      this.playerService.addPlayer(this.team, { ...this.player });

      this.player.name = '';
      this.player.surname = '';
      this.player.number = null;

      // this.playersChange.emit(this.players);
    } else {
      this.presentAlert();
    }
  }

  onDeletePlayer(playerToDelete: Player) {
    // this.players = this.players.filter((player) => player !== playerToDelete);
    this.playerService.deletePlayer(this.team, playerToDelete);
    // this.playersChange.emit(this.players);
  }

  navigateToPage(){
    if(this.team == 'home'){
      this.router.navigateByUrl('playersGuest');
    }else{
      //TODO: promeni ovo na utakmicu samu da se prebaci
      this.router.navigateByUrl('/');
    }
  }
}
