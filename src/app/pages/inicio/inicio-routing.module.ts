import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioPage } from './inicio.page';
 
const routes: Routes = [
  {
    path: '',
    component: InicioPage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'mis-gastos',
      },
      {
        path: 'mis-gastos',
        loadChildren: () => import('../mis-gastos/mis-gastos.module').then((m) => m.MisGastosPageModule),
      },
      {
        path: 'sobrantes',
        loadChildren: () => import('../sobrantes/sobrantes.module').then((m) => m.SobrantesPageModule),
      },
      {
        path: 'devoluciones',
        loadChildren: () => import('../devoluciones/devoluciones.module').then((m) => m.DevolucionesPageModule),
      },
      {
        path: 'liquidaciones',
        loadChildren: () => import('../liquidaciones/liquidaciones.module').then((m) => m.LiquidacionesPageModule),
      },
      {
        path: 'historial',
        loadChildren: () => import('../historial/historial.module').then((m) => m.HistorialPageModule),
      },
      {
        path: 'estados-cuenta',
        loadChildren: () => import('../estados-cuenta/estados-cuenta.module').then((m) => m.EstadosCuentaPageModule),
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
