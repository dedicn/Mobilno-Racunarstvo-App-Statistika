import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
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

    // Pronalazak igrača po više parametara
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
          const homeTeamID = this.gameService.getTeam('home').name; 
          const guestTeamID = this.gameService.getTeam('guest').name;

          const homePlayers = players.filter(
            (player) => player.team.name === homeTeamID
          );
          const guestPlayers = players.filter(
            (player) => player.team.name === guestTeamID
          );

          this.playersHomeSubject.next(homePlayers);
          this.playersGuestSubject.next(guestPlayers);
        })
      );
  }

  // saveAllPlayersToDB() {
  //   const playersHome = this.playersHomeSubject.value;
  //   const playersGuest = this.playersGuestSubject.value;
  //   console.log('saveALlPl');

  //   const saveRequests: Observable<Player>[] = [];

  //   playersHome.forEach((player) => {
  //     saveRequests.push(this.savePlayerToDB(player));
  //   });

  //   playersGuest.forEach((player) => {
  //     saveRequests.push(this.savePlayerToDB(player));
  //   });

  //   console.log('prosao save svih');

  //   return forkJoin(saveRequests).pipe(
  //     tap((savedPlayers) => {
  //       // Ažuriraj liste igrača sa novim ID-jevima
  //       const updatedHomePlayers = savedPlayers.filter(
  //         (player) => player.team.name === this.gameService.getTeam('home').name
  //       );
  //       const updatedGuestPlayers = savedPlayers.filter(
  //         (player) =>
  //           player.team.name === this.gameService.getTeam('guest').name
  //       );

  //       this.playersHomeSubject.next(updatedHomePlayers);
  //       this.playersGuestSubject.next(updatedGuestPlayers);
  //     })
  //   );
  // }

  //jedan po jedan igrac
  savePlayerToDB(player: Player) {
    console.log("pozvana savePlayer");
    let id: string;
    return this.http
      .post(
        'https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/players.json',
        player
      )
      .pipe(
        map((responseData: any) => {
          return {
            id: responseData.name,
            name: responseData.name,
            surname: responseData.surname,
            number: responseData.number,
            team: responseData.team,
            stats: responseData.stats,
          };
        }),
        take(1),
        tap((savedPlayer: Player) => {
          console.log("id plyar" + savedPlayer.id);
          const newPlayerList =
            savedPlayer.team.teamID === 'home'
              ? this.playersHomeSubject.value.filter(
                  (player) =>
                    player.name !== savedPlayer.name ||
                    player.surname !== savedPlayer.surname ||
                    player.number !== savedPlayer.number
                )
              : this.playersGuestSubject.value.filter(
                  (player) =>
                    player.name !== savedPlayer.name ||
                    player.surname !== savedPlayer.surname ||
                    player.number !== savedPlayer.number
                );

          if (savedPlayer.team.teamID === 'home') {
            this.playersHomeSubject.next([...newPlayerList, savedPlayer]);
          } else {
            this.playersGuestSubject.next([...newPlayerList, savedPlayer]);
          }
        })
      );
  }

  // updateAllPlayersInDB(): Observable<any> {
  //   const playersHome = this.playersHomeSubject.value;
  //   const playersGuest = this.playersGuestSubject.value;

  //   // Kombinujemo sve igrače u jednu listu
  //   const allPlayers = [...playersHome, ...playersGuest];

  //   // Kreiramo zahteve za ažuriranje za svakog igrača
  //   const updateRequests: Observable<any>[] = allPlayers.map(
  //     (player: Player) => {
  //       return this.updatePlayerInDB(player.id, player).pipe(
  //         map((response: any) => {
  //           // Vraćamo ažuriranog igrača sa ID-em
  //           return {
  //             ...player,
  //             id: player.id,
  //           };
  //         })
  //       );
  //     }
  //   );

  //   // Koristimo forkJoin da pošaljemo sve zahteve istovremeno
  //   return forkJoin(updateRequests).pipe(
  //     tap((updatedPlayers: Player[]) => {
  //       // Ažuriramo BehaviorSubject sa novim vrednostima igrača
  //       const updatedHomePlayers = updatedPlayers.filter(
  //         (player) => player.team.teamID === 'home'
  //       );
  //       const updatedGuestPlayers = updatedPlayers.filter(
  //         (player) => player.team.teamID === 'guest'
  //       );

  //       this.playersHomeSubject.next(updatedHomePlayers);
  //       this.playersGuestSubject.next(updatedGuestPlayers);
  //     })
  //   );
  // }

  updatePlayerInDB(playerID: string, updatedPlayer: Player) {
    return this.http.put(
      `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/players/${playerID}.json`,
      updatedPlayer
    );
  }

  deletePlayersFromDB() {
    const playersHome = this.playersHomeSubject.value;
    const playersGuest = this.playersGuestSubject.value;

    // Kombinujemo sve igrače u jednu listu
    const allPlayers = [...playersHome, ...playersGuest];

    // Kreiramo zahteve za brisanje za svakog igrača
    const deleteRequests: Observable<any>[] = allPlayers.map(
      (player: Player) => {
        return this.http.delete(
          `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/players/${player.id}.json`
        );
      }
    );

    // Koristimo forkJoin da pošaljemo sve zahteve za brisanje istovremeno
    return forkJoin(deleteRequests).pipe(
      tap(() => {
        // Nakon uspešnog brisanja, osvežavamo BehaviorSubject-ove
        this.playersHomeSubject.next([]);
        this.playersGuestSubject.next([]);
      })
    );
  }
}
