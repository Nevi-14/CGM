import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlGastosPage } from './control-gastos.page';

const routes: Routes = [
  {
    path: '',
    component: ControlGastosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlGastosPageRoutingModule {}
