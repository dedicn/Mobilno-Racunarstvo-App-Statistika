import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Team } from '../team.model';
import { AlertController } from '@ionic/angular';
import { TeamsService } from '../teams.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams-view',
  templateUrl: './teams-view.component.html',
  styleUrls: ['./teams-view.component.scss'],
})
export class TeamsViewComponent implements OnInit {
  @Input() team: Team = { teamID: '', name: '', players: null, isActive: true };
  @Output() deleteTeam = new EventEmitter<void>();
  @Output() editTeam = new EventEmitter<void>();

  constructor() {}
  ngOnInit(): void {
  }

  onDelete() {
    this.deleteTeam.emit();
  }

  onEdit(){
    this.editTeam.emit();
  }
}
