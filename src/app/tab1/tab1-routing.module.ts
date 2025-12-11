// src/app/tab1/tab1-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';
import { TabsPage } from '../tabs/tabs.page';

// src/app/tabs/tabs-routing.module.ts (Extrait)

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'analyze',
        // Utilisation de loadComponent pour charger la page Standalone (Tab 1)
        loadComponent: () => import('../tab1/tab1.page').then(m => m.Tab1Page),
      },
      {
        path: 'quiz', // L'onglet 2 doit toujours pointer vers son module (car il n'est pas Standalone)
        loadChildren: () => import('../tab2/tab2.page').then(m => m.Tab2Page)
      },
      {
        path: 'info', // L'onglet 3 doit toujours pointer vers son module
        loadChildren: () => import('../tab3/tab3.page').then(m => m.Tab3Page)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/analyze',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}