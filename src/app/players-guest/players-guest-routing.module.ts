import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayersGuestPage } from './players-guest.page';

const routes: Routes = [
  {
    path: '',
    component: PlayersGuestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayersGuestPageRoutingModule {}
