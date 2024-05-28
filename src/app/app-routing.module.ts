import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'teams',
    loadChildren: () => import('./teams/teams.module').then( m => m.TeamsPageModule)
  },
  {
    path: 'players',
    loadChildren: () => import('./players/players.module').then( m => m.PlayersPageModule)
  },
  {
    path: 'players-home',
    loadChildren: () => import('./players-home/players-home.module').then( m => m.PlayersHomePageModule)
  },
  {
    path: 'players-guest',
    loadChildren: () => import('./players-guest/players-guest.module').then( m => m.PlayersGuestPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }