import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadosCuentaPage } from './estados-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: EstadosCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadosCuentaPageRoutingModule {}
