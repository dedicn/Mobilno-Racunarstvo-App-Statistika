import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth-service.service';
import { Player } from 'src/app/player.model';
import { PlayerService } from 'src/app/players-service.service';
import { Team } from 'src/app/team.model';
import { TeamsService } from 'src/app/teams.service';

@Component({
  selector: 'app-admin-players',
  templateUrl: './admin-players.page.html',
  styleUrls: ['./admin-players.page.scss'],
})
export class AdminPlayersPage implements OnInit, ViewWillEnter {
  players: Player[] = [];
  teams: Team[] = [];
  selectedTeam: Team | null = null;
  previousSelectedTeam: Team | null = null;

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private teamService: TeamsService,
    private router: Router
  ) {}

  ionViewWillEnter(): void {
    this.teamService.getActiveTeamsFromDB().subscribe((teams) => {
      this.teams = teams;
    });
  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let isAdmin = localStorage.getItem('isAdmin');

    if (token && isAdmin && isAdmin === 'true') {
    } else {
      this.router.navigateByUrl('/log-in');
      return;
    }
  }

  player: Player = {
    id: '',
    name: '',
    surname: '',
    number: null,
    selected: false,
    stats: null,
  };
  maxPlayers: number = 6;

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Greška',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  onAddPlayer(playerForm: NgForm) {
    if (!this.selectedTeam) {
      this.presentAlert('Morate da selektujete tim.');
      return;
    }

    let pl: Player[] = [];
    if (this.selectedTeam.players) {
      pl = Object.keys(this.selectedTeam.players).map(
        (key) =>
          this.selectedTeam!.players![
            key as keyof typeof this.selectedTeam.players
          ] as Player
      );
    }

    if (pl.length < this.maxPlayers && playerForm.valid) {
      const newPlayer: Player = {
        id: '',
        name: playerForm.value.name,
        surname: playerForm.value.surname,
        number: playerForm.value.number,
        selected: false,
        stats: null,
      };

      this.teamService
        .insertPlayerToTeamInDB(this.selectedTeam, newPlayer)
        .subscribe(() => {
          this.teamService.getActiveTeamsFromDB().subscribe((teams) => {
            this.teams = teams;
            this.selectedTeam =
              this.teams.find(
                (team) => team.teamID === this.selectedTeam!.teamID
              ) || null;
            this.setPlayers();
          });
          playerForm.resetForm({
            selectedTeam: this.selectedTeam,
            name: '',
            surname: '',
            number: '',
          });
        });
    } else {
      this.presentAlert('Tim mora da ima minimum 3, a maksimum 6 igrača!');
    }
  }

  onDeletePlayer(playerToDelete: Player) {
    if (this.selectedTeam && this.selectedTeam.players) {
      this.selectedTeam.players = Object.keys(this.selectedTeam.players)
        .map(
          (key) =>
            this.selectedTeam!.players![
              key as keyof typeof this.selectedTeam.players
            ] as Player
        )
        .filter((p) => p.id !== playerToDelete.id);

      this.teamService.updateTeamInDB(this.selectedTeam).subscribe(() => {
        this.teamService.getActiveTeamsFromDB().subscribe(() => {
          this.setPlayers();
        });
      });
    }
  }

  setPlayers() {
    if (this.selectedTeam && this.selectedTeam.players) {
      this.players = Object.keys(this.selectedTeam.players).map(
        (key) =>
          this.selectedTeam!.players![
            key as keyof typeof this.selectedTeam.players
          ] as Player
      );
    } else {
      this.players = [];
    }
  }

  onTeamChange(newTeam: Team, playerForm: NgForm) {
    if (
      this.previousSelectedTeam &&
      this.previousSelectedTeam.players &&
      this.previousSelectedTeam.teamID !== this.selectedTeam?.teamID
    ) {
      const currentTeamPlayers = Object.keys(
        this.previousSelectedTeam.players
      ).map(
        (key) =>
          this.previousSelectedTeam!.players![
            key as keyof typeof this.previousSelectedTeam.players
          ] as Player
      );

      if (currentTeamPlayers.length < 3) {
        this.presentAlert(
          'Tim mora da ima minimum 3 igrača pre nego što promenite tim.'
        );
        setTimeout(() => {
          this.selectedTeam = this.previousSelectedTeam;
          playerForm.controls['selectedTeam'].setValue(
            this.previousSelectedTeam
          );
        });

        return;
      } else if (currentTeamPlayers.length === 0) {
        this.presentAlert('Tim nema nijednog igrača.');
        setTimeout(() => {
          this.selectedTeam = this.previousSelectedTeam;
          playerForm.controls['selectedTeam'].setValue(
            this.previousSelectedTeam
          );
        });

        return;
      }
    }

    this.previousSelectedTeam = newTeam;
    this.selectedTeam = newTeam;
    this.setPlayers();
  }
}
