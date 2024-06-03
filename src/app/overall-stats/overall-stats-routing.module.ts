import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverallStatsPage } from './overall-stats.page';

const routes: Routes = [
  {
    path: '',
    component: OverallStatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverallStatsPageRoutingModule {}
