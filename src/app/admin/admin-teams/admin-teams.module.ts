import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminTeamsPageRoutingModule } from './admin-teams-routing.module';

import { AdminTeamsPage } from './admin-teams.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminTeamsPageRoutingModule,
    SharedModule,
  ],
  declarations: [AdminTeamsPage],
})
export class AdminTeamsPageModule {}
