import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPlayersPage } from './admin-players.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPlayersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPlayersPageRoutingModule {}
