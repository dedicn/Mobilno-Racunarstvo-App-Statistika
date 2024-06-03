import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../game.service';
import { GameStats } from '../game-stats.model';
import { Game } from '../game.model';
import { Player } from '../player.model';
import { PlayerService } from '../players-service.service';
import { PlayerModalComponent } from '../player-modal/player-modal.component';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  homePoints: number = 0;
  homePointsSub: Subscription = new Subscription();
  guestPoints: number = 0;
  guestPointsSub: Subscription = new Subscription();

  game: Game = {
    id: '',
    gameCode: '',
    date: new Date(),
    homePoints: 0,
    guestPoints: 0,
    home: this.gameService.getTeam('home'),
    guest: this.gameService.getTeam('guest'),
  };
  gameSubs: Subscription = new Subscription();

  gameStats: GameStats = {
    game: this.game,
    faulsHome: 0,
    assistsHome: 0,
    onePMHome: 0,
    twoPMHome: 0,
    onePAHome: 0,
    twoPAHome: 0,
    OREBHome: 0,
    DREBHome: 0,
    faulsGuest: 0,
    assistsGuest: 0,
    onePMGuest: 0,
    twoPMGuest: 0,
    onePAGuest: 0,
    twoPAGuest: 0,
    OREBGuest: 0,
    DREBGuest: 0,
    TOHome: 0,
    TOGuest: 0,
  };
  gameStatsSubs: Subscription = new Subscription();

  // { name: 'neko', surname: 'neko', number: 2 }
  playersGuest: Player[] = [];
  playersHomeSubs: Subscription = new Subscription();

  playersHome: Player[] = [];
  playersGuestSubs: Subscription = new Subscription();

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private playerModal: ModalController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  async openPlayerModal(player: any, teamType: 'home' | 'guest') {
    const modal = await this.playerModal.create({
      component: PlayerModalComponent,
      componentProps: { player, teamType },
    });
    return await modal.present();
  }

  async confirmEndGame() {
    if(this.homePoints == this.guestPoints){
      const alert = await this.alertCtrl.create({
        header: 'Greska!',
        message: 'Utakmica mora da se zavrsi sa pobednikom.',
        buttons: ['OK'],
      });

      await alert.present();
    }else{
      const alert = await this.alertCtrl.create({
        header: 'Kraj',
        message: 'Da li sigurno želite da završite utakmicu?',
        buttons: [
          {
            text: 'Ne',
            role: 'cancel',
          },
          {
            text: 'Da',
            handler: () => {
              this.endGame();
            },
          },
        ],
      });

      await alert.present();
    }
  }

  async confirmeDeliteGame() {
    const alert = await this.alertCtrl.create({
      header: 'Kraj',
      message: 'Da li sigurno želite da obrišete utakmicu?',
      buttons: [
        {
          text: 'Ne',
          role: 'cancel',
        },
        {
          text: 'Da',
          handler: () => {
            this.deleteGame();
          },
        },
      ],
    });

    await alert.present();
  }

  deleteGame(){
    localStorage.setItem('savedCodeGame', JSON.stringify(''));
    this.playerService.deletePlayersFromDB().subscribe();
    this.gameService.deleteGameStats().subscribe();
    this.gameService.deleteGame().subscribe();
  }

  endGame() {
    //TODO: ovde ide za bazu da se sacuva sve
    console.log('Utakmica je završena');
    this.gameService.updateGame().subscribe();
    this.gameService.updateGameStats().subscribe();
    this.router.navigateByUrl('overall-stats');
  }

  addTO(teamType: 'home' | 'guest') {
    this.gameService.addTO(teamType);
  }

  ngOnInit() {
    this.homePointsSub = this.gameService.homePoints.subscribe((points) => {
      this.homePoints = points;
    });

    this.guestPointsSub = this.gameService.guestPoints.subscribe((points) => {
      this.guestPoints = points;
    });

    this.playersGuestSubs = this.playerService.playersGuest.subscribe(
      (players) => {
        this.playersGuest = players;
      }
    );

    this.playersHomeSubs = this.playerService.playersHome.subscribe(
      (players) => {
        this.playersHome = players;
      }
    );

    

    this.gameStatsSubs = this.gameService.gameStats.subscribe((gameStat) => {
      this.gameStats = gameStat;
    });
  }
}
