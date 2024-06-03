import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';

import { GamePage } from './game.page';
import { PlayerComponent } from '../player/player.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamePageRoutingModule
  ],
  declarations: [GamePage, PlayerComponent]
})
export class GamePageModule {}
