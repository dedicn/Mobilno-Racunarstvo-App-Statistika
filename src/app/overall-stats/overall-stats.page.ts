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
    gameCode: '',
    id: '',
    date: new Date(),
    homePoints: 0,
    guestPoints: 0,
    home: this.gameService.getTeam('home'),
    guest: this.gameService.getTeam('guest'),
    stats: null,
  };

  gameSt: GameStats = {
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

  game: Game = this.gm;

  playersGuest: Player[] = [];
  playersGuestView: Player[] | null = [];

  playersHome: Player[] = [];
  playersHomeView: Player[] | null = [];


  winningTeam: string = '';
  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gameService.gameStats.subscribe((gameSt) => {
      this.gameStats = gameSt;
      this.winningTeam = this.gameService.getWinnigTeam();
    });

    this.gameService.game.subscribe((game) => {
      this.game = game;
    });

    this.playerService.playersHome.subscribe((players) => {
      this.playersHome = players;
    });

    this.playerService.playersGuest.subscribe((players) => {
      this.playersGuest = players;
    });
  
    this.playersGuestView = this.playersGuest.filter(
      (player) => player.selected
    );
    this.playersHomeView = this.playersHome.filter((player) => player.selected);

    console.log('Pobednik je: ' + this.winningTeam);
  }

  goHome() {
    localStorage.removeItem('savedCodeGame');
    this.gameService.setToDefault();
    this.playerService.setToDefault();
    this.router.navigateByUrl('home');
  }
}
