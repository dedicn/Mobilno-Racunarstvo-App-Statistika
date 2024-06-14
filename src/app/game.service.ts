import { Injectable } from '@angular/core';
import { Team } from './team.model';
import { BehaviorSubject } from 'rxjs';
import { Game } from './game.model';
import { GameStats } from './game-stats.model';
import { HttpClient } from '@angular/common/http';
import { tap, catchError,map, take, scan, throwIfEmpty } from 'rxjs/operators';
import { PlayerService } from './players-service.service';
import { Player } from './player.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private homePointsSubject = new BehaviorSubject<number>(0);
  private guestPointsSubject = new BehaviorSubject<number>(0);

  homePoints = this.homePointsSubject.asObservable();
  guestPoints = this.guestPointsSubject.asObservable();

  private gameCode: string = '';
  private teams: { home: Team; guest: Team } = {
    home: { teamID: '', name: '', players: null },
    guest: { teamID: '', name: '', players: null },
  };

  gameSt: GameStats = {
    faulsHome: 0,
    assistsHome: 0,
    onePMHome: 0,
    twoPMHome: 0,
    onePAHome: 0,
    twoPAHome: 0,
    OREBHome: 0,
    DREBHome: 0,
    faulsGuest: 0,
    assistsGuest: 0,
    onePMGuest: 0,
    twoPMGuest: 0,
    onePAGuest: 0,
    twoPAGuest: 0,
    OREBGuest: 0,
    DREBGuest: 0,
    TOHome: 0,
    TOGuest: 0,
  };
  private gameStatsSubject = new BehaviorSubject<GameStats>(this.gameSt);
  gameStats = this.gameStatsSubject.asObservable();

  gameObject: Game = {
    id: '',
    gameCode: this.gameCode,
    date: new Date(),
    homePoints: this.homePointsSubject.value,
    guestPoints: this.guestPointsSubject.value,
    home: this.teams['home'],
    guest: this.teams['guest'],
    stats: this.gameStatsSubject.value,
  };

  private gameSubject = new BehaviorSubject<Game>(this.gameObject);
  game = this.gameSubject.asObservable();

  constructor(private http: HttpClient) {}

  setPlayersForTeam(players: Player[], teamT: string){
    const gameUpdates = this.gameSubject.value;

    if(teamT === "home"){
      gameUpdates.home.players = players;
    }else{
      gameUpdates.guest.players = players;
    }

    console.log(gameUpdates.home.players);
    console.log(gameUpdates.guest.players);

    this.gameSubject.next(gameUpdates);
  }

  addPoints(teamType: 'home' | 'guest', points: number) {
    if (teamType === 'home') {
      const currentPoints = this.homePointsSubject.value;
      this.homePointsSubject.next(currentPoints + points);
    } else if (teamType === 'guest') {
      const currentPoints = this.guestPointsSubject.value;
      this.guestPointsSubject.next(currentPoints + points);
    } else {
      console.error('Invalid team type');
    }

    const game = this.gameSubject.value;
    game.homePoints = this.homePointsSubject.value;
    game.guestPoints = this.guestPointsSubject.value;
    this.gameSubject.next(game);
  }

  updateFauls(teamType: 'home' | 'guest', fauls: number) {
    const currentStats = this.gameStatsSubject.value;
    const updatedStats = { ...currentStats };

    if (teamType === 'home') {
      updatedStats.faulsHome += fauls;
    } else if (teamType === 'guest') {
      updatedStats.faulsGuest += fauls;
    }

    this.gameStatsSubject.next(updatedStats);
  }

  updateAssists(teamType: 'home' | 'guest', assists: number) {
    const currentStats = this.gameStatsSubject.value;
    const updatedStats = { ...currentStats };

    if (teamType === 'home') {
      updatedStats.assistsHome += assists;
    } else if (teamType === 'guest') {
      updatedStats.assistsGuest += assists;
    }

    this.gameStatsSubject.next(updatedStats);
  }

  addTO(teamType: 'home' | 'guest') {
    const currentStats = this.gameStatsSubject.value;
    const updatedStats = { ...currentStats };

    if (teamType === 'home') {
      updatedStats.TOHome += 1;
    } else if (teamType === 'guest') {
      updatedStats.TOGuest += 1;
    }

    this.gameStatsSubject.next(updatedStats);

    this.updateGameStats().subscribe();
  }

  updateOnePM(teamType: 'home' | 'guest', onePM: number) {
    const currentStats = this.gameStatsSubject.value;
    const updatedStats = { ...currentStats };
    const gm = this.gameSubject.value;

    if (teamType === 'home') {
      const currentPoints = this.homePointsSubject.value;
      this.homePointsSubject.next(currentPoints + onePM);
      updatedStats.onePMHome += onePM;
      this.gameObject.homePoints += onePM;
      gm.homePoints += onePM;
      gm.stats = updatedStats;
      // this.gameSubject.value.homePoints += onePM;
      // this.gameSubject.next();
    } else if (teamType === 'guest') {
      const currentPoints = this.guestPointsSubject.value;
      this.guestPointsSubject.next(currentPoints + onePM);
      updatedStats.onePMGuest += onePM;
      this.gameObject.guestPoints += onePM;

      gm.guestPoints += onePM;
      gm.stats = updatedStats;
    }

    this.gameStatsSubject.next(updatedStats);
    this.gameSubject.next(gm);
  }

  updateTwoPM(teamType: 'home' | 'guest', twoPM: number) {
    const currentStats = this.gameStatsSubject.value;
    const updatedStats = { ...currentStats };
    const gm = this.gameSubject.value;

    if (teamType === 'home') {
      const currentPoints = this.homePointsSubject.value;
      this.homePointsSubject.next(currentPoints + 2);
      updatedStats.twoPMHome += twoPM;
      this.gameObject.homePoints += 2;

      gm.homePoints += 2;
      gm.stats = updatedStats;
    } else if (teamType === 'guest') {
      const currentPoints = this.guestPointsSubject.value;
      this.guestPointsSubject.next(currentPoints + 2);
      updatedStats.twoPMGuest += twoPM;
      this.gameObject.guestPoints += 2;

      gm.guestPoints += 2;
      gm.stats = updatedStats;
      this.gameSubject.next(gm);
    }

    this.gameStatsSubject.next(updatedStats);
  }

  updateOnePA(teamType: 'home' | 'guest', onePA: number) {
    const currentStats = this.gameStatsSubject.value;
    const updatedStats = { ...currentStats };

    if (teamType === 'home') {
      const currentPoints = this.homePointsSubject.value;
      this.homePointsSubject.next(currentPoints + onePA);
      updatedStats.onePAHome += onePA;
      this.gameObject.homePoints += onePA;
    } else if (teamType === 'guest') {
      const currentPoints = this.guestPointsSubject.value;
      this.guestPointsSubject.next(currentPoints + onePA);
      this.gameObject.guestPoints += onePA;
    }

    this.gameStatsSubject.next(updatedStats);
  }

  updateTwoPA(teamType: 'home' | 'guest', twoPA: number) {
    const currentStats = this.gameStatsSubject.value;
    const updatedStats = { ...currentStats };

    if (teamType === 'home') {
      const currentPoints = this.homePointsSubject.value;
      this.homePointsSubject.next(currentPoints + twoPA);
      updatedStats.twoPAHome += twoPA;
      this.gameObject.homePoints += twoPA;
    } else if (teamType === 'guest') {
      const currentPoints = this.guestPointsSubject.value;
      this.guestPointsSubject.next(currentPoints + twoPA);
      updatedStats.twoPAGuest += twoPA;
      this.gameObject.guestPoints += twoPA;
    }

    this.gameStatsSubject.next(updatedStats);
  }

  updateOREB(teamType: 'home' | 'guest', OREB: number) {
    const currentStats = this.gameStatsSubject.value;
    const updatedStats = { ...currentStats };

    if (teamType === 'home') {
      updatedStats.OREBHome += OREB;
    } else if (teamType === 'guest') {
      updatedStats.OREBGuest += OREB;
    }

    this.gameStatsSubject.next(updatedStats);
  }

  updateDREB(teamType: 'home' | 'guest', DREB: number) {
    const currentStats = this.gameStatsSubject.value;
    const updatedStats = { ...currentStats };

    if (teamType === 'home') {
      updatedStats.DREBHome += DREB;
    } else if (teamType === 'guest') {
      updatedStats.DREBGuest += DREB;
    }

    this.gameStatsSubject.next(updatedStats);
  }

  setGameCode(code: string) {
    this.gameCode = code;
    this.updateGameObject();
  }

  updateGameObject() {
    this.gameObject = {
      gameCode: this.gameCode,
      id: this.gameSubject.value.id,
      date: new Date(),
      homePoints: this.homePointsSubject.value,
      guestPoints: this.guestPointsSubject.value,
      home: this.teams['home'],
      guest: this.teams['guest'],
      stats: this.gameSubject.value.stats,
    };
    this.gameSubject.next(this.gameObject);
  }

  getGameCode(): string {
    return this.gameCode;
  }

  getGame(): Game {
    return this.gameSubject.value;
  }

  setTeam(teamType: 'home' | 'guest', team: Team) {
    this.teams[teamType] = team;
    console.log(`Postavljen tim ${teamType}:`, team);

    if (teamType === 'home') {
      this.gameSubject.value.home = team;
    } else if (teamType === 'guest') {
      this.gameSubject.value.guest = team;
    }

    this.gameSubject.next(this.gameSubject.value);
  }

  getTeam(teamType: 'home' | 'guest'): Team {
    return this.teams[teamType];
  }

  getWinnigTeam() {
    const game = this.gameSubject.value;

    if (game.homePoints > game.guestPoints) {
      console.log(game.home.name);
      return game.home.name;
    } else if (game.guestPoints > game.homePoints) {
      console.log(game.guest.name);
      return game.guest.name;
    } else {
      return 'Nerešeno';
    }
  }

  getGameStats(): GameStats {
    return this.gameSt;
  }

  saveGameToLocalStorage() {
    const gameCodeToSave = this.gameCode;
    localStorage.setItem('savedCodeGame', JSON.stringify(gameCodeToSave));
  }

  loadGameFromLocalStorage() {
    const savedGame = localStorage.getItem('savedCodeGame');
    if (savedGame) {
      const game: string = JSON.parse(savedGame);
      // this.gameSubject.next(game);
      // console.log('Game loaded from localStorage', game);
    }
    return savedGame;
  }

  saveGame() {
    const gameToSave = this.gameSubject.value;
    let id: string;
    return this.http
      .post<{ name: string }>(
        'https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/game.json',
        gameToSave
      )
      .pipe(
        map((response) => {
          id = response.name;
          const updatedGame = {
            ...gameToSave,
          };
          return updatedGame;
        }),
        take(1),
        tap((savedGame) => {
          savedGame.id = id;
          console.log(
            'id igre je' + savedGame.id + 'neki deo ' + savedGame.gameCode
          );
          console.log('Game saved', savedGame);
          this.gameSubject.next(savedGame);
        }),
        catchError((error) => {
          console.error('Error saving game', error);
          throw error;
        })
      );
  }

  getGameFromDB() {
    return this.http
      .get<{ [key: string]: Game }>(
        'https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/game.json'
      )
      .pipe(
        map((responseData) => {
          const gamesArray: Game[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              const game = responseData[key];
              gamesArray.push({
                id: key,
                gameCode: game.gameCode,
                date: new Date(game.date),
                homePoints: game.homePoints,
                guestPoints: game.guestPoints,
                home: game.home,
                guest: game.guest,
                stats: game.stats,
              });
            }
          }
          return gamesArray.length > 0 ? gamesArray[0] : null;
        }),
        tap((game) => {
          if (game) {
            this.gameSubject.next(game);
          }
        })
      );
  }

  setToDefault(){
    this.homePointsSubject.next(0);
    this.guestPointsSubject.next(0);
    this.gameStatsSubject.next(this.gameSt);
    const gameObject: Game = {
      id: '',
      gameCode: this.gameCode,
      date: new Date(),
      homePoints: this.homePointsSubject.value,
      guestPoints: this.guestPointsSubject.value,
      home: { teamID: '', name: '', players: null },
      guest: { teamID: '', name: '', players: null },
      stats: null,
    };

    this.gameSubject.next(gameObject);
  }

  updateGame() {
    const gameID = this.gameSubject.value.id;
    console.log(this.gameSubject.value.stats?.TOGuest);
    // this.playerService.playersHome.subscribe((players) =>{
    //   this.gameSubject.value.home.players = players;
    // });

    // this.playerService.playersGuest.subscribe((players) => {
    //   this.gameSubject.value.guest.players = players;
    // });

    console.log(this.gameSubject.value);
    console.log('upd' + this.gameSubject.value.guest.name);
    console.log('upd' + this.gameSubject.value.home.name);
    return this.http
      .put<Game>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/game/${gameID}.json`,
        this.gameSubject.value
      )
      .pipe(
        tap((responseGame: Game) => {
          this.gameSubject.next(responseGame);
        })
      );
  }

  deleteGame() {
    return this.http
      .delete<void>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/game/${this.gameSubject.value.id}.json`
      )
      .pipe(
        tap(() => {
          // Ažurirajte BehaviorSubject na null ili neku praznu vrednost nakon brisanja
          this.gameSubject.next({
            id: '',
            gameCode: '',
            date: new Date(),
            homePoints: 0,
            guestPoints: 0,
            home: { teamID: '', name: '', players: null },
            guest: { teamID: '', name: '', players: null },
            stats: null,
          });
          console.log(
            `Game with ID ${this.gameSubject.value.gameCode} deleted successfully.`
          );
        })
      );
  }

  getGameStatsFromDB(gameID: string) {
    return this.http
      .get<{ [key: string]: any }>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/game/${gameID}/stats.json`
      )
      .pipe(
        map((responseData: { [key: string]: any }) => {
          const gameStats: GameStats = {
            // game: {
            //   id: responseData['game']['id'],
            //   gameCode: responseData['game']['gameCode'],
            //   date: new Date(responseData['game']['date']),
            //   homePoints: responseData['game']['homePoints'],
            //   guestPoints: responseData['game']['guestPoints'],
            //   home: {
            //     teamID: responseData['game']['home']['teamID'],
            //     name: responseData['game']['home']['name'],
            //   },
            //   guest: {
            //     teamID: responseData['game']['guest']['teamID'],
            //     name: responseData['game']['guest']['name'],
            //   },
            // },
            faulsHome: responseData['faulsHome'],
            assistsHome: responseData['assistsHome'],
            onePMHome: responseData['onePMHome'],
            twoPMHome: responseData['twoPMHome'],
            onePAHome: responseData['onePAHome'],
            twoPAHome: responseData['twoPAHome'],
            OREBHome: responseData['OREBHome'],
            DREBHome: responseData['DREBHome'],
            faulsGuest: responseData['faulsGuest'],
            assistsGuest: responseData['assistsGuest'],
            onePMGuest: responseData['onePMGuest'],
            twoPMGuest: responseData['twoPMGuest'],
            onePAGuest: responseData['onePAGuest'],
            twoPAGuest: responseData['twoPAGuest'],
            OREBGuest: responseData['OREBGuest'],
            DREBGuest: responseData['DREBGuest'],
            TOHome: responseData['TOHome'],
            TOGuest: responseData['TOGuest'],
          };
          return gameStats;
        }),
        tap((responseStats: GameStats) => {
          this.gameStatsSubject.next(responseStats);
        })
      );
  }

  saveGameStatsToDB(gameStats: GameStats) {
    return this.http
      .post<{ name: string }>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/game/${this.gameSubject.value.id}/stats.json`,
        gameStats
      )
      .pipe(
        map((responseData) => {
          return {
            ...gameStats,
            game: {
              // ...gameStats.game,
              gameID: responseData.name,
            },
          };
        }),
        tap((savedGameStats: GameStats) => {
          this.gameStatsSubject.next(savedGameStats);
        })
      );
  }

  //Menjaj samo da ide stats
  updateGameStats() {
    const gameID = this.gameSubject.value.id;
    return this.http
      .put<GameStats>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/game/${gameID}/stats.json`,
        this.gameStatsSubject.value
      )
      .pipe(
        tap((responseStats: GameStats) => {
          this.gameStatsSubject.next(responseStats);
        })
      );
  }

  deleteGameStats() {
    return this.http
      .delete<void>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/game/${this.gameSubject.value.id}/stats.json`
      )
      .pipe(
        tap(() => {
          this.gameStatsSubject.next({
            faulsHome: 0,
            assistsHome: 0,
            onePMHome: 0,
            twoPMHome: 0,
            onePAHome: 0,
            twoPAHome: 0,
            OREBHome: 0,
            DREBHome: 0,
            faulsGuest: 0,
            assistsGuest: 0,
            onePMGuest: 0,
            twoPMGuest: 0,
            onePAGuest: 0,
            twoPAGuest: 0,
            OREBGuest: 0,
            DREBGuest: 0,
            TOHome: 0,
            TOGuest: 0,
          });
        })
      );
  }
}
