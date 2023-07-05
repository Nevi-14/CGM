import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleNotificacionesPage } from './detalle-notificaciones.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleNotificacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleNotificacionesPageRoutingModule {}
