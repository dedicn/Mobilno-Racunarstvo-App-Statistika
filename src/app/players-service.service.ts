import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Player {
  name: string;
  surname: string;
  number: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersHomeSubject = new BehaviorSubject<Player[]>([]);
  private playersGuestSubject = new BehaviorSubject<Player[]>([]);

  playersHome = this.playersHomeSubject.asObservable();
  playersGuest = this.playersGuestSubject.asObservable();

  constructor() {}

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

  updateHomePlayers(players: Player[]) {
    this.playersHomeSubject.next(players);
  }

  updateGuestPlayers(players: Player[]) {
    this.playersGuestSubject.next(players);
  }

  // Metode za sinhronizaciju sa backend bazom podataka
  savePlayersToDatabase() {
    // Implementacija za slanje podataka na server
  }

  loadPlayersFromDatabase() {
    // Implementacija za preuzimanje podataka sa servera
  }
}
