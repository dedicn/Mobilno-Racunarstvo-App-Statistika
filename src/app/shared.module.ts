
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PlayerInputFormComponent } from './player-input-form/player-input-form.component';
import { PlayerViewComponent } from './player-view/player-view.component';
import { TeamsViewComponent } from './teams-view/teams-view.component';
import { EditTeamModalComponent } from './edit-team-modal/edit-team-modal.component';
import { StatsModalComponent } from './stats-modal/stats-modal.component';
import { StatsViewComponent } from './stats-view/stats-view.component';


@NgModule({
  declarations: [
    PlayerInputFormComponent,
    PlayerViewComponent,
    TeamsViewComponent,
    EditTeamModalComponent,
    StatsModalComponent,
    StatsViewComponent,

  ],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [
    PlayerInputFormComponent,
    PlayerViewComponent,
    TeamsViewComponent,
    EditTeamModalComponent,
    StatsModalComponent,
    StatsViewComponent,

  ],
})
export class SharedModule {}
