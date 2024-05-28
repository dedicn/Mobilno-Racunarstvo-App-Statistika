import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../players-service.service';
import { Subscription } from 'rxjs';

interface Player {
  name: string;
  surname: string;
  number: number | null;
}

@Component({
  selector: 'app-players-guest',
  templateUrl: './players-guest.page.html',
  styleUrls: ['./players-guest.page.scss'],
})
export class PlayersGuestPage implements OnInit {
  playersGuest: Player[] = []; 
  playersSubs: Subscription = new Subscription();

  constructor(private playerService: PlayerService) {}
  ngOnInit() {
    this.playersSubs = this.playerService.playersGuest.subscribe((players) => {
      this.playersGuest = players;
    });
  }
}
