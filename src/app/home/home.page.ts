import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';
import { ViewDidEnter, ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, ViewDidEnter, ViewWillEnter {
  gameCode: string = '';

  constructor(private router: Router, private gameService: GameService) {}

  ngOnInit(): void {
    const savedGameCode = localStorage.getItem('savedGameCode');
    if (savedGameCode === null || savedGameCode === '') {
      this.gameCode = '';
    } else {
      this.gameCode = savedGameCode;
    }
  }

  ionViewWillEnter(): void {
    const savedGameCode = localStorage.getItem('savedGameCode');
    if (savedGameCode === null || savedGameCode === '') {
      this.gameCode = '';
    } else {
      this.gameCode = savedGameCode;
    }
  }

  ionViewDidEnter(): void {
    const savedGameCode = localStorage.getItem('savedGameCode');
    if (savedGameCode === null || savedGameCode === '') {
      this.gameCode = '';
    } else {
      this.gameCode = savedGameCode;
    }
  }

  onAddGame() {
    if (this.gameCode.length >= 6) {
      console.log('Kod utakmice:', this.gameCode);
      this.gameService.setGameCode(this.gameCode);

      const storedGameCode = localStorage.getItem('savedCodeGame');
      console.log(storedGameCode);
      if (storedGameCode !== null && storedGameCode !== "") {
        console.log("ipak ovde");
        this.gameService.updateGame().subscribe();
        this.gameService.saveGameToLocalStorage();
      } else {
        console.log('doslo do ovde');
        this.gameService.saveGame().subscribe();
        this.gameService.saveGameToLocalStorage();
      }

      this.router.navigateByUrl('/teams');
    } else {
      console.log('Kod utakmice mora imati najmanje 6 znakova.');
    }
  }
}
