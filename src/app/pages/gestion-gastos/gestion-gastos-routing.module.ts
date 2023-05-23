import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionGastosPage } from './gestion-gastos.page';

const routes: Routes = [
  {
    path: '',
    component: GestionGastosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionGastosPageRoutingModule {}
