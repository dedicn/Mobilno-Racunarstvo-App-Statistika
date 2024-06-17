import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, throwError } from 'rxjs';
import { Player } from './player.model';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map, take } from 'rxjs/operators';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersHomeSubject = new BehaviorSubject<Player[]>([]);
  private playersGuestSubject = new BehaviorSubject<Player[]>([]);

  playersHome = this.playersHomeSubject.asObservable();
  playersGuest = this.playersGuestSubject.asObservable();

  constructor(private http: HttpClient, private gameService: GameService) {}

  setToDefault(){
    const player: Player[] = [];
    this.playersGuestSubject.next(player);
    this.playersHomeSubject.next(player);
  }

  addPlayer(team: 'home' | 'guest', player: Player) {
    if (team === 'home') {
      const currentPlayers = this.playersHomeSubject.value;
      if (currentPlayers.length < 4) {
        this.playersHomeSubject.next([...currentPlayers, player]);
      } else {
        alert('Maksimalan broj igrača (4) je dostignut.');
      }
    } else if (team === 'guest') {
      const currentPlayers = this.playersGuestSubject.value;
      if (currentPlayers.length < 4) {
        this.playersGuestSubject.next([...currentPlayers, player]);
      } else {
        alert('Maksimalan broj igrača (4) je dostignut.');
      }
    }
  }

  deletePlayer(team: 'home' | 'guest', player: Player) {
    if (team === 'home') {
      const currentPlayers = this.playersHomeSubject.value;
      this.playersHomeSubject.next(currentPlayers.filter((p) => p !== player));
    } else if (team === 'guest') {
      const currentPlayers = this.playersGuestSubject.value;
      this.playersGuestSubject.next(currentPlayers.filter((p) => p !== player));
    }
  }

  updatePlayerStats(player: Player, teamType: 'home' | 'guest'): void {
    let players: Player[];
    let updatedPlayers: Player[];

    if (teamType === 'home') {
      players = this.playersHomeSubject.value;
      updatedPlayers = [...players];
    } else {
      players = this.playersGuestSubject.value;
      updatedPlayers = [...players];
    }

    const playerIndex = updatedPlayers.findIndex(
      (p) =>
        p.name === player.name &&
        p.surname === player.surname &&
        p.number === player.number
    );

    if (playerIndex !== -1) {
      updatedPlayers[playerIndex] = player;

      if (teamType === 'home') {
        this.playersHomeSubject.next(updatedPlayers);
      } else {
        this.playersGuestSubject.next(updatedPlayers);
      }
    }
  }

  getAllPlayersFromDB() {
    return this.http
      .get<{ [key: string]: Player }>(
        'https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/players.json'
      )
      .pipe(
        map((responseData) => {
          const playersArray: Player[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              playersArray.push({
                ...responseData[key],
              });
            }
          }
          return playersArray;
        }),
        tap((players) => {
          // const homeTeamID = this.gameService.getTeam('home').name;
          // const guestTeamID = this.gameService.getTeam('guest').name;

          // const homePlayers = players.filter(
          //   (player) => player.team.name === homeTeamID
          // );
          // const guestPlayers = players.filter(
          //   (player) => player.team.name === guestTeamID
          // );

          // this.playersHomeSubject.next(homePlayers);
          // this.playersGuestSubject.next(guestPlayers);
        })
      );
  }

  //jedan po jedan igrac
  savePlayerToDB(player: Player, team: string) {
    console.log('pozvana savePlayer');
    const gameId = this.gameService.getGame().id;
    console.log(`${gameId} od igre`);

    const playerToSave = { ...player }; 
    console.log(`${player.name} ${player.surname} od igre`);

    return this.http
      .post<{ name: string }>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/games/${gameId}/${team}/players.json`,
        playerToSave
      )
      .pipe(
        map((response) => {
          playerToSave.id = response.name;
          return playerToSave;
        }),
        take(1),
        tap((savedPlayer) => {
          console.log(
            `Player ID: ${savedPlayer.id}, Name: ${savedPlayer.name}`
          );

          let newPlayerList;
          if (team === 'home') {
            newPlayerList = this.playersHomeSubject.value.filter(
              (p) =>
                p.name !== savedPlayer.name ||
                p.surname !== savedPlayer.surname ||
                p.number !== savedPlayer.number
            );
            console.log(`Dužina home liste: ${newPlayerList.length}`);
            newPlayerList = [...newPlayerList, savedPlayer];
            this.playersHomeSubject.next(newPlayerList);
          } else {
            newPlayerList = this.playersGuestSubject.value.filter(
              (p) =>
                p.name !== savedPlayer.name ||
                p.surname !== savedPlayer.surname ||
                p.number !== savedPlayer.number
            );
            console.log(`Dužina guest liste: ${newPlayerList.length}`);
            newPlayerList = [...newPlayerList, savedPlayer];
            this.playersGuestSubject.next(newPlayerList);
          }

          console.log(`Player saved to ${team} team:`, savedPlayer);
        }),
        catchError((error) => {
          console.error('Error saving player', error);
          return throwError(error);
        })
      );
  }

  updatePlayerInDB(playerID: string, updatedPlayer: Player, team: string) {
    console.log(team);
    console.log(playerID)
    console.log(updatedPlayer.stats);
    return this.http.put(
      `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/games/${
        this.gameService.getGame().id
      }/${team}/players/${playerID}.json`,
      updatedPlayer
    );
  }

  deletePlayerFromDB(playerID: string, player: Player, team: string) {
    console.log('brisnaje igraca sa id:  ' + playerID);
    console.log(team);
    return this.http.delete(
      `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/games/${
        this.gameService.getGame().id
      }/${team}/players/${playerID}.json`
    );
  }

  deletePlayersFromDB() {
    const playersHome = this.playersHomeSubject.value;
    const playersGuest = this.playersGuestSubject.value;
    let id = this.gameService.getGame().id;

    playersHome.map(
      (player: Player) => {
        return this.http.delete(
          `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/games/${id}/home/${player.id}.json`
        );
      }
    );

    playersGuest.map(
      (player: Player) => {
        return this.http.delete(
          `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/games/${id}/guest/${player.id}.json`
        );
      }
    );

    this.playersHomeSubject.next([]);
    this.playersGuestSubject.next([]);
  }


  setPlayers(team: "home" | "guest", players:Player[]){
    if(team === "home"){
      this.playersHomeSubject.next(players);
    }else{
      this.playersGuestSubject.next(players);
    }
  }
}
