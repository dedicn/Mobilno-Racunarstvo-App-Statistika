import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth-service.service';
import { StatsModalComponent } from 'src/app/stats-modal/stats-modal.component';
import { UserSimple } from 'src/app/user-simple.model';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.page.html',
  styleUrls: ['./admin-stats.page.scss'],
})
export class AdminStatsPage implements OnInit {
  activeStats: UserSimple[] = [];
  stats!: UserSimple;
  newStat: UserSimple = {id: "",name:"", surname: "", email: "", password: "", isActive: true};

  constructor(
    private authService: AuthService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ionViewDidEnter(): void {
    this.authService.getAllStats().subscribe((stats) => {
      this.activeStats = stats;
    });

    this.authService.users.subscribe((stats) => {
      this.activeStats = stats;
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


    this.authService.users.subscribe((stats) => {
      this.activeStats = stats;
    });
  }

  onAddStats(StatForm: NgForm) {
    console.log(StatForm.value);
    this.newStat.name = StatForm.value.statsName;
    this.newStat.surname = StatForm.value.statsSurname;
    this.newStat.email = StatForm.value.statsEmail;
    this.newStat.password = StatForm.value.statsPassword;
    console.log(this.newStat)
    this.authService.register(this.newStat, "user").subscribe(() => {
      StatForm.reset();
    });
  }

  onDeleteStats(statToDelete: UserSimple) {
    statToDelete.isActive = false;
    this.authService
      .deleteUser(statToDelete)
      .pipe(switchMap(() => this.authService.getAllStats()))
      .subscribe((stat) => {
        this.activeStats = stat;
      });
  }

  async onEditStats(statToEdit: UserSimple) {
    const modal = await this.modalController.create({
      component: StatsModalComponent,
      componentProps: { stat: statToEdit },
    });

    modal.onDidDismiss().then((result) => {
      console.log(result.data);
      const updateStat = result.data;
      if (updateStat) {
        this.authService.updateUser(updateStat.id, updateStat).subscribe();
      }
    });

    return await modal.present();
  }
}
