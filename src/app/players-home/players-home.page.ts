import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../players-service.service';
import { Subscription } from 'rxjs';
import { Player } from '../player.model';

@Component({
  selector: 'app-players-home',
  templateUrl: './players-home.page.html',
  styleUrls: ['./players-home.page.scss'],
})
export class PlayersHomePage implements OnInit {
  playersHome: Player[] = [];
  playersSubs: Subscription = new Subscription;

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.playersSubs = this.playerService.playersHome.subscribe((players) => {
      this.playersHome = players;
    })
  }
}
