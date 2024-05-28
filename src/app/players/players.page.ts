// import { Component, OnInit } from '@angular/core';

// interface Player {
//   name: string;
//   surname: string;
//   number: number | null;
// }

// @Component({
//   selector: 'app-players',
//   templateUrl: './players.page.html',
//   styleUrls: ['./players.page.scss'],
// })
// export class PlayersPage implements OnInit {
//   playerHome: Player = {
//     name: '',
//     surname: '',
//     number: null,
//   };

//   playersHome: Player[] = [];
//   maxPlayers: number = 4;
//   errorMessage: string = '';

//   constructor() {}

//   onAddPlayersHome() {
//     if (this.playersHome.length < this.maxPlayers) {
//       this.playersHome.push({ ...this.playerHome });

//       this.playerHome.name = '';
//       this.playerHome.surname = '';
//       this.playerHome.number = null;

//       this.errorMessage = '';
//     } else {
      
//       this.errorMessage = 'Maksimalan broj igrača (4) je dostignut.';
//     }
//   }

//   onDeletePlayer(playerToDelete: Player) {
//     this.playersHome = this.playersHome.filter(
//       (player) => player !== playerToDelete
//     );
//     this.errorMessage = '';
//   }
//   ngOnInit() {}
// }

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface Player {
  name: string;
  surname: string;
  number: number | null;
}

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {
  playerHome: Player = {
    name: '',
    surname: '',
    number: null,
  };

  playersHome: Player[] = [];
  maxPlayers: number = 4;

  constructor(private alertController: AlertController) {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Greška',
      message: 'Tim može da čini maksimalno 4 igrača!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  onAddPlayersHome() {
    if (this.playersHome.length < this.maxPlayers) {
      this.playersHome.push({ ...this.playerHome });

      // Resetovanje forme
      this.playerHome.name = '';
      this.playerHome.surname = '';
      this.playerHome.number = null;
    } else {
      this.presentAlert();
    }
  }

  onDeletePlayer(playerToDelete: Player) {
    this.playersHome = this.playersHome.filter(
      (player) => player !== playerToDelete
    );
  }

  ngOnInit() {}
}

