import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Subscribable, Subscription } from 'rxjs';
import { Player } from '../player.model';
import { PlayerService } from '../players-service.service';
import { Router } from '@angular/router';
import { PlayerStats } from '../player-stats.model';
import { GameStats } from '../game-stats.model';
import { Game } from '../game.model';

@Component({
  selector: 'app-overall-stats',
  templateUrl: './overall-stats.page.html',
  styleUrls: ['./overall-stats.page.scss'],
})
export class OverallStatsPage implements OnInit {
  gm: Game = {
    gameCode:'',
    id: '',
    date: new Date(),
    homePoints: 0,
    guestPoints: 0,
    home: this.gameService.getTeam('home'),
    guest: this.gameService.getTeam('guest'),
  };

  gameSt: GameStats = {
    game: this.gm,
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
  gameStats: GameStats = this.gameSt;
  gameStatsSub: Subscription = new Subscription();

  game: Game = this.gm;
  gameSub: Subscription = new Subscription();

  playersGuest: Player[] = [];
  playersGuestSubs: Subscription = new Subscription();

  playersHome: Player[] = [];
  playersHomeSubs: Subscription = new Subscription();

  winningTeam: string = '';
  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gameStatsSub = this.gameService.gameStats.subscribe((gameSt) => {
      this.gameStats = gameSt;
      this.winningTeam = this.gameService.getWinnigTeam();
    });

    this.gameSub = this.gameService.game.subscribe((game) => {
      this.game = game;
    });

    this.playerService.playersHome.subscribe((players) => {
      this.playersHome = players.map((player) => {
        if (!player.stats) {
          player.stats = {
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
        return player;
      });
    });

    this.playerService.playersGuest.subscribe((players) => {
      this.playersGuest = players.map((player) => {
        if (!player.stats) {
          player.stats = {
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
        return player;
      });
    });

    console.log("Pobednik je: " + this.winningTeam);
  }

  goHome() {
    localStorage.setItem('savedCodeGame', JSON.stringify(''));
    this.router.navigateByUrl('home');
  }
}
