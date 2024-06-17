import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminTeamsPage } from './admin-teams.page';

const routes: Routes = [
  {
    path: '',
    component: AdminTeamsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTeamsPageRoutingModule {}
