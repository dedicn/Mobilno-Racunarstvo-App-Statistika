import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayersGuestPageRoutingModule } from './players-guest-routing.module';

import { PlayersGuestPage } from './players-guest.page';
import { PlayerInputFormComponent } from '../player-input-form/player-input-form.component';
import { PlayerViewComponent } from '../player-view/player-view.component';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayersGuestPageRoutingModule,
    SharedModule
  ],
  declarations: [PlayersGuestPage],
})
export class PlayersGuestPageModule {}
