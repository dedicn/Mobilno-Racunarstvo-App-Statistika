import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PlayerModalComponent } from './player-modal/player-modal.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [PlayerModalComponent],
  exports: [PlayerModalComponent],
})
export class PlayerModalModule {}
