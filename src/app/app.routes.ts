import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'metricas',
    pathMatch: 'full'
  },
  {
    path: 'metricas',
    loadComponent: () => import('./metricas/metricas.component').then(m => m.MetricasComponent)
  },
  {
    path: 'analitica',
    loadComponent: () => import('./analitica/analitica.component').then(m => m.AnaliticaComponent)
  },
  {
    path: 'exportar',
    loadComponent: () => import('./exportar/exportar.component').then(m => m.ExportarComponent)
  },
  {
    path: '**',
    redirectTo: 'metricas'
  }
];
