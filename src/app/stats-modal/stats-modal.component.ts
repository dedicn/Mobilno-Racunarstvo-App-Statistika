import { Component, Input, OnInit } from '@angular/core';
import { UserSimple } from '../user-simple.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-stats-modal',
  templateUrl: './stats-modal.component.html',
  styleUrls: ['./stats-modal.component.scss'],
})
export class StatsModalComponent implements OnInit {
  @Input() stat!: UserSimple;
  originalStat!: UserSimple;

  constructor(private modalController: ModalController) {}
  ngOnInit(): void {
    this.originalStat = this.stat;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const updatedStat = { ...this.stat, ...form.value };
      this.modalController.dismiss(updatedStat);
    } else {
      this.modalController.dismiss();
    }
  }

  onCancel() {
    this.modalController.dismiss();
  }
}
