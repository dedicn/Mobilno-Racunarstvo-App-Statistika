import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayersHomePage } from './players-home.page';

const routes: Routes = [
  {
    path: '',
    component: PlayersHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayersHomePageRoutingModule {}
