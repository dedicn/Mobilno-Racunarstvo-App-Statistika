import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPlayersPageRoutingModule } from './admin-players-routing.module';

import { AdminPlayersPage } from './admin-players.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPlayersPageRoutingModule,
    SharedModule
  ],
  declarations: [AdminPlayersPage]
})
export class AdminPlayersPageModule {}
