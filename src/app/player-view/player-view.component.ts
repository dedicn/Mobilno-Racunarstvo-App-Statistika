import { OnInit } from '@angular/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Player } from '../player.model';
import { GameService } from '../game.service';
import { PlayerStats } from '../player-stats.model';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss'],
})
export class PlayerViewComponent implements OnInit {
  constructor(private gameService: GameService) {}

  gameStats: PlayerStats = {
    fauls: 0,
    assists: 0,
    onePM: 0,
    twoPM: 0,
    onePA: 0,
    twoPA: 0,
    OREB: 0,
    DREB: 0,
  };

  @Input() players: Player = {
    id: '',
    name: '',
    surname: '',
    number: 0,
    stats: this.gameStats,
  };
  @Output() deletePlayer = new EventEmitter<void>();

  onDelete() {
    this.deletePlayer.emit();
  }

  ngOnInit() {}
}
