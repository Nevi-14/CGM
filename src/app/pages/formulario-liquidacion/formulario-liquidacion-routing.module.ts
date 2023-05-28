import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormularioLiquidacionPage } from './formulario-liquidacion.page';

const routes: Routes = [
  {
    path: '',
    component: FormularioLiquidacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioLiquidacionPageRoutingModule {}
