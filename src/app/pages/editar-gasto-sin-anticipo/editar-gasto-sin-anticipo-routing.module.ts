import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarGastoSinAnticipoPage } from './editar-gasto-sin-anticipo.page';

const routes: Routes = [
  {
    path: '',
    component: EditarGastoSinAnticipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarGastoSinAnticipoPageRoutingModule {}
