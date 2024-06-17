import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminStatsPageRoutingModule } from './admin-stats-routing.module';

import { AdminStatsPage } from './admin-stats.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminStatsPageRoutingModule,
    SharedModule
  ],
  declarations: [AdminStatsPage]
})
export class AdminStatsPageModule {}
