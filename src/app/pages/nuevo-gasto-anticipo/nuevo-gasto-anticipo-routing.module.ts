import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoGastoAnticipoPage } from './nuevo-gasto-anticipo.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoGastoAnticipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoGastoAnticipoPageRoutingModule {}
