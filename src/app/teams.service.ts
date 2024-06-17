import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';
import { Team } from './team.model';
import { HttpClient } from '@angular/common/http';
import { Player } from './player.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private teamsSubject = new BehaviorSubject<Team[]>([]);

  teams = this.teamsSubject.asObservable();
  constructor(private http: HttpClient) {}

  getActiveTeamsFromDB(): Observable<Team[]> {
    return this.http
      .get<{ [key: string]: Team }>(
        'https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/teams.json'
      )
      .pipe(
        map((responseData) => {
          const teamsArray: Team[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              const team = responseData[key];
              if (team.isActive) {
                teamsArray.push({
                  teamID: key,
                  name: team.name,
                  players: team.players,
                  isActive: team.isActive,
                });
              }
            }
          }
          return teamsArray;
        }),
        tap((activeTeams) => {
          this.teamsSubject.next(activeTeams);
        })
      );
  }

  addTeamToDB(team: Team): Observable<{ name: string }> {
    return this.http
      .post<{ name: string }>(
        'https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/teams.json',
        team
      )
      .pipe(
        tap((response) => {
          const newTeam: Team = {
            ...team,
            teamID: response.name,
          };
          const currentTeams = this.teamsSubject.value;
          this.teamsSubject.next([...currentTeams, newTeam]);
        })
      );
  }

  updateTeamInDB(team: Team): Observable<void> {
    return this.http
      .put<void>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/teams/${team.teamID}.json`,
        team
      )
      .pipe(
        tap(() => {
          const currentTeams = this.teamsSubject.value;
          const teamIndex = currentTeams.findIndex(
            (t) => t.teamID === team.teamID
          );
          if (teamIndex !== -1) {
            currentTeams[teamIndex] = team;
            this.teamsSubject.next([...currentTeams]);
          }
          console.log(`Team with ID ${team.teamID} updated`);
        })
      );
  }

  insertPlayerToTeamInDB(team: Team, player: Player) {
    return this.http
      .post<{ name: string }>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/teams/${team.teamID}/players.json`,
        player
      )
      .pipe(
        switchMap((response) => {
          player.id = response.name;
          if (!team.players || !Array.isArray(team.players)) {
            team.players = [];
          }
          team.players.push(player);
          console.log(player);
          return this.http.patch<void>(
            `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/teams/${team.teamID}/players/${player.id}.json`,
            player
          );
        }),
        tap(() => {
          const currentTeams = this.teamsSubject.value;
          const teamIndex = currentTeams.findIndex(
            (t) => t.teamID === team.teamID
          );
          if (teamIndex !== -1) {
            currentTeams[teamIndex] = team;
            this.teamsSubject.next([...currentTeams]);
          }
          console.log(
            `Player with ID ${player.id} added to team with ID ${team.teamID}`
          );
        })
      );
  }
}
