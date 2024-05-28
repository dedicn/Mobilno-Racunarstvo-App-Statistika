import { OnInit } from '@angular/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Player {
  name: string;
  surname: string;
  number: number | null;
}

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss'],
})
export class PlayerViewComponent implements OnInit {
  constructor() {}

  @Input() players: Player = { name: '', surname: '', number: 0 };
  @Output() deletePlayer = new EventEmitter<void>();

  onDelete() {
    this.deletePlayer.emit();
  }

  ngOnInit() {}
}
