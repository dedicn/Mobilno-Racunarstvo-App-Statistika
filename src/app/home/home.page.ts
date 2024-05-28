import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  gameCode: string = '';
  constructor(private router: Router) {}

  onAddGame() {
    if (this.gameCode.length >= 6) {
      console.log('Kod utakmice:', this.gameCode);
      this.router.navigateByUrl('/teams');
      
    } else {
      console.log('Kod utakmice mora imati najmanje 6 znakova.');
    }
  }
}
