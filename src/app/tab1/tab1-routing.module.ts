// src/app/tab1/tab1-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';

const routes: Routes = [
  {
    path: 'analyse', // Le chemin vide renvoie au composant Tab1Page
    loadComponent: () => import('../tab1/tab1.page').then(m => m.Tab1Page),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}