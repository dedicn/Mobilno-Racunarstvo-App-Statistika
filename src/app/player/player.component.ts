import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from '../player.model';
import { PlayerStats } from '../player-stats.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
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

  @Input() player: Player = {
    id: '',
    name: '',
    surname: '',
    number: 0,
    selected: false,
    stats: this.gameStats,
  };
  @Input() index: number = 1;

  @Output() playerClicked = new EventEmitter<void>();

  onClick() {
    this.playerClicked.emit();
  }
  constructor(private gameService: GameService) {}

  ngOnInit() {}
}
