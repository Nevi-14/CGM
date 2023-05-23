import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MostrarGastosPage } from './mostrar-gastos.page';

const routes: Routes = [
  {
    path: '',
    component: MostrarGastosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MostrarGastosPageRoutingModule {}
