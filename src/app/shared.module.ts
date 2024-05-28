
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PlayerInputFormComponent } from './player-input-form/player-input-form.component';
import { PlayerViewComponent } from './player-view/player-view.component';


@NgModule({
  declarations: [PlayerInputFormComponent, PlayerViewComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [PlayerInputFormComponent, PlayerViewComponent],
})
export class SharedModule {}
