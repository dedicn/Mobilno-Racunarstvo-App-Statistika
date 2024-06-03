import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  gameCode: string = '';
  constructor(private router: Router, private gameService: GameService) {}

  onAddGame() {
    if (this.gameCode.length >= 6) {
      console.log('Kod utakmice:', this.gameCode);
      this.gameService.setGameCode(this.gameCode);

      const storedGameCode = localStorage.getItem('savedCodeGame');
      console.log(storedGameCode);
      if (storedGameCode !== null) {
        this.gameService.updateGame().subscribe();
        this.gameService.saveGameToLocalStorage();
      } else {
        console.log("doslo");
        this.gameService.saveGame().subscribe();
        this.gameService.saveGameToLocalStorage();
      }

      this.router.navigateByUrl('/teams');
    } else {
      console.log('Kod utakmice mora imati najmanje 6 znakova.');
    }
  }
}
