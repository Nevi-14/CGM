import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoGastoSinAnticipoPage } from './nuevo-gasto-sin-anticipo.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoGastoSinAnticipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoGastoSinAnticipoPageRoutingModule {}
