import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { GameService } from '../game.service';
import { Player } from '../player.model';
import { PlayerStats } from '../player-stats.model';
import { PlayerService } from '../players-service.service';

@Component({
  selector: 'app-player-modal',
  templateUrl: './player-modal.component.html',
  styleUrls: ['./player-modal.component.scss'],
})
export class PlayerModalComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private gameService: GameService,
    private playerService: PlayerService,
    private alertController: AlertController
  ) {}

  gameStats: any;
  // gameStats: PlayerStats = {
  //   game: this.gameService.getGame(),
  //   fauls: 0,
  //   assists: 0,
  //   onePM: 0,
  //   twoPM: 0,
  //   onePA: 0,
  //   twoPA: 0,
  //   OREB: 0,
  //   DREB: 0,
  // };

  // Player = {
  //   id: '',
  //   name: '',
  //   surname: '',
  //   number: 0,
  //   stats: this.gameStats,
  //   team: this.gameService.getTeam('home'),
  // };
  @Input() player: Player = {
    id: '',
    name: '',
    surname: '',
    number: 0,
    stats: {
      fauls: 0,
      assists: 0,
      onePM: 0,
      twoPM: 0,
      onePA: 0,
      twoPA: 0,
      OREB: 0,
      DREB: 0,
    },
  };
  @Input() teamType: 'home' | 'guest' = 'home';

  ngOnInit() {
    console.log(
      'Statistika igraca' +
        this.player.name +
        ' stat: ' +
        this.player.stats?.onePM
    );
    
    if (!this.player.stats) {
      this.player.stats = {
        fauls: 0,
        assists: 0,
        onePM: 0,
        twoPM: 0,
        onePA: 0,
        twoPA: 0,
        OREB: 0,
        DREB: 0,
      };
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Greška',
      message: 'Ne mozete da izbrisete neposotjucu statistiku igracu!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  updateStat(statType: string, value: number) {
    if (this.player.stats) {
      let canUpdate = true;
      switch (statType) {
        case 'assists':
          if (this.player.stats.assists + value < 0) {
            canUpdate = false;
          } else {
            this.player.stats.assists += value;
            this.gameService.updateAssists(this.teamType, value);
          }
          break;
        case 'fauls':
          if (this.player.stats.fauls + value < 0) {
            canUpdate = false;
          } else {
            this.player.stats.fauls += value;
            this.gameService.updateFauls(this.teamType, value);
          }
          break;
        case 'onePM':
          if (this.player.stats.onePM + value < 0) {
            canUpdate = false;
          } else {
            this.player.stats.onePM += value;
            this.gameService.updateOnePM(this.teamType, value);
          }
          break;
        case 'twoPM':
          if (this.player.stats.twoPM + value < 0) {
            canUpdate = false;
          } else {
            this.player.stats.twoPM += value;
            this.gameService.updateTwoPM(this.teamType, value);
          }
          break;
        case 'onePA':
          if (this.player.stats.onePA + value < 0) {
            canUpdate = false;
          } else {
            this.player.stats.onePA += value;
            this.gameService.updateOnePA(this.teamType, value);
          }
          break;
        case 'twoPA':
          if (this.player.stats.twoPA + value < 0) {
            canUpdate = false;
          } else {
            this.player.stats.twoPA += value;
            this.gameService.updateTwoPA(this.teamType, value);
          }
          break;
        case 'DREB':
          if (this.player.stats.DREB + value < 0) {
            canUpdate = false;
          } else {
            this.player.stats.DREB += value;
            this.gameService.updateDREB(this.teamType, value);
          }
          break;
        case 'OREB':
          if (this.player.stats.OREB + value < 0) {
            canUpdate = false;
          } else {
            this.player.stats.OREB += value;
            this.gameService.updateOREB(this.teamType, value);
          }
          break;
      }
      if (!canUpdate) {
        this.presentAlert();
        return;
      }

      this.playerService.updatePlayerStats(this.player, this.teamType);

      this.playerService
        .updatePlayerInDB(this.player.id, this.player, this.teamType)
        .subscribe();
      this.gameService.updateGameStats().subscribe();

      this.dismissModal();
    }
  }
}
