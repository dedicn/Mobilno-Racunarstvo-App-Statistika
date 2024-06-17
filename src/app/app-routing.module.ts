import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'log-in',
    pathMatch: 'full',
  },
  {
    path: 'teams',
    loadChildren: () =>
      import('./teams/teams.module').then((m) => m.TeamsPageModule),
  },
  {
    path: 'players-home',
    loadChildren: () =>
      import('./players-home/players-home.module').then(
        (m) => m.PlayersHomePageModule
      ),
  },
  {
    path: 'players-guest',
    loadChildren: () =>
      import('./players-guest/players-guest.module').then(
        (m) => m.PlayersGuestPageModule
      ),
  },
  {
    path: 'game',
    loadChildren: () =>
      import('./game/game.module').then((m) => m.GamePageModule),
  },
  {
    path: 'overall-stats',
    loadChildren: () =>
      import('./overall-stats/overall-stats.module').then(
        (m) => m.OverallStatsPageModule
      ),
  },
  {
    path: 'log-in',
    loadChildren: () =>
      import('./auth/log-in/log-in.module').then((m) => m.LogInPageModule),
  },
  {
    path: 'admin-home',
    loadChildren: () => import('./admin/admin-home/admin-home.module').then( m => m.AdminHomePageModule)
  },
  {
    path: 'admin-teams',
    loadChildren: () => import('./admin/admin-teams/admin-teams.module').then( m => m.AdminTeamsPageModule)
  },
  {
    path: 'admin-players',
    loadChildren: () => import('./admin/admin-players/admin-players.module').then( m => m.AdminPlayersPageModule)
  },
  {
    path: 'admin-stats',
    loadChildren: () => import('./admin/admin-stats/admin-stats.module').then( m => m.AdminStatsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
