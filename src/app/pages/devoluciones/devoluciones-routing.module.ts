import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevolucionesPage } from './devoluciones.page';

const routes: Routes = [
  {
    path: '',
    component: DevolucionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevolucionesPageRoutingModule {}
