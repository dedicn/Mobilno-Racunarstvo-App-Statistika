import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ModalController, ViewDidEnter } from '@ionic/angular';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth-service.service';
import { EditTeamModalComponent } from 'src/app/edit-team-modal/edit-team-modal.component';
import { Team } from 'src/app/team.model';
import { TeamsService } from 'src/app/teams.service';

@Component({
  selector: 'app-admin-teams',
  templateUrl: './admin-teams.page.html',
  styleUrls: ['./admin-teams.page.scss'],
})
export class AdminTeamsPage implements OnInit, ViewDidEnter {
  activeTeams: Team[] = [];
  newTeam: Team = {
    teamID: '',
    name: '',
    players: [],
    isActive: true,
  };

  constructor(
    private teamsService: TeamsService,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router
  ) {}

  ionViewDidEnter(): void {
    this.teamsService.getActiveTeamsFromDB().subscribe();

    this.teamsService.teams.subscribe((teams) => {
      this.activeTeams = teams;
    });
  }

  ngOnInit() {
    let token = localStorage.getItem('token');
    let isAdmin = localStorage.getItem('isAdmin');

    if (token && isAdmin && isAdmin === 'true') {
      // this.authService.getUserByToken(token).subscribe({
      //   next: (user) => {
      //     if (!user) {
      //       this.router.navigateByUrl('/log-in');
      //       return;
      //     }
      //   },
      //   error: (error) => {
      //     console.error('Greška pri dobijanju korisnika:', error);
      //     this.router.navigateByUrl('/log-in');
      //   },
      // });
    } else {
      this.router.navigateByUrl('/log-in');
      return;
    }

    this.teamsService.teams.subscribe((teams) => {
      this.activeTeams = teams;
    });
  }

  onAddTeam(TeamForm: NgForm) {
    const teamToAdd: Team = {
      teamID: '',
      name: TeamForm.value.teamsName,
      players: null,
      isActive: true,
    };

    this.teamsService.addTeamToDB(teamToAdd).subscribe(() => {
      console.log('Tim uspešno dodat.');
      TeamForm.reset();
    });
  }

  onDeleteTeam(teamToDelete: Team) {
    teamToDelete.isActive = false;
    this.teamsService
      .updateTeamInDB(teamToDelete)
      .pipe(switchMap(() => this.teamsService.getActiveTeamsFromDB()))
      .subscribe((teams) => {
        this.activeTeams = teams;
      });
  }

  async onEditTeam(teamToEdit: Team) {
    const modal = await this.modalController.create({
      component: EditTeamModalComponent,
      componentProps: { team: teamToEdit },
    });

    modal.onDidDismiss().then((result) => {
      console.log(result.data);
      const updateTeam = result.data;
      if (updateTeam) {
        this.teamsService.updateTeamInDB(updateTeam).subscribe();
      }
    });

    return await modal.present();
  }
}
