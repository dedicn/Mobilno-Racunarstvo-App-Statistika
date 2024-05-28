import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../players-service.service';
import { Subscription } from 'rxjs';


interface Player {
  name: string;
  surname: string;
  number: number | null;
}

@Component({
  selector: 'app-players-home',
  templateUrl: './players-home.page.html',
  styleUrls: ['./players-home.page.scss'],
})
export class PlayersHomePage implements OnInit {
  // playersHome = this.playerService.playersHome;
  playersHome: Player[] = [];
  playersSubs: Subscription = new Subscription;

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.playersSubs = this.playerService.playersHome.subscribe((players) => {
      this.playersHome = players;
    })
  }
}
