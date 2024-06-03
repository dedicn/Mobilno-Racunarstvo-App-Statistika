import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OverallStatsPageRoutingModule } from './overall-stats-routing.module';

import { OverallStatsPage } from './overall-stats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OverallStatsPageRoutingModule
  ],
  declarations: [OverallStatsPage]
})
export class OverallStatsPageModule {}
