import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
    private playerService: PlayerService
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
      game: this.gameService.getGame(),
      fauls: 0,
      assists: 0,
      onePM: 0,
      twoPM: 0,
      onePA: 0,
      twoPA: 0,
      OREB: 0,
      DREB: 0,
    },
    team: {
      teamID: '',
      name: '',
    },
  };
  @Input() teamType: 'home' | 'guest' = 'home';

  ngOnInit() {

    console.log('Statistika igraca' + this.player.name + " stat: " + this.player.stats?.onePM );
    // Ensure the player has a separate instance of stats
    if (!this.player.stats) {
      this.player.stats = {
        game: this.gameService.getGame(),
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

  updateStat(statType: string, value: number) {
    if (this.player.stats) {
      switch (statType) {
        case 'assists':
          this.player.stats.assists += value;
          this.gameService.updateAssists(this.teamType, value);
          break;
        case 'fauls':
          this.player.stats.fauls += value;
          this.gameService.updateFauls(this.teamType, value);
          break;
        case 'onePM':
          this.player.stats.onePM += value;
          this.gameService.updateOnePM(this.teamType, value);
          break;
        case 'twoPM':
          this.player.stats.twoPM += value;
          this.gameService.updateTwoPM(this.teamType, value);
          break;
        case 'onePA':
          this.player.stats.onePA += value;
          this.gameService.updateOnePA(this.teamType, value);
          break;
        case 'twoPA':
          this.player.stats.twoPA += value;
          this.gameService.updateTwoPA(this.teamType, value);
          break;
        case 'DREB':
          this.player.stats.DREB += value;
          this.gameService.updateDREB(this.teamType, value);
          break;
        case 'OREB':
          this.player.stats.OREB += value;
          this.gameService.updateOREB(this.teamType, value);
          break;
      }

    this.playerService.updatePlayerStats(this.player, this.teamType);

    this.playerService
      .updatePlayerInDB(this.player.id, this.player)
      .subscribe();
    this.gameService.updateGameStats().subscribe();

    this.dismissModal();
  }
}
}
