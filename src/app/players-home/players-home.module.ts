import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayersHomePageRoutingModule } from './players-home-routing.module';

import { PlayersHomePage } from './players-home.page';
import { PlayerInputFormComponent } from '../player-input-form/player-input-form.component';
import { PlayerViewComponent } from '../player-view/player-view.component';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayersHomePageRoutingModule,
    SharedModule
    // PlayerInputFormComponent,
    // PlayerViewComponent,
  ],
  declarations: [
    PlayersHomePage,
    // PlayerInputFormComponent,
    // PlayerViewComponent,
  ],
})
export class PlayersHomePageModule {}
