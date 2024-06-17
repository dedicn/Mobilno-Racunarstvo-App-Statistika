import { Component, Input, OnInit } from '@angular/core';
import { Team } from '../team.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-team-modal',
  templateUrl: './edit-team-modal.component.html',
  styleUrls: ['./edit-team-modal.component.scss'],
})
export class EditTeamModalComponent implements OnInit {
  @Input() team!: Team;

  constructor(private modalController: ModalController) {}
  ngOnInit(): void {
    
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const updatedTeam = { ...this.team, ...form.value };
      this.modalController.dismiss(updatedTeam);
    } else {
      this.modalController.dismiss();
    }
  }

  onCancel() {
    this.modalController.dismiss();
  }
}
