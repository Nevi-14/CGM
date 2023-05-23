import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiposGastosPage } from './tipos-gastos.page';

const routes: Routes = [
  {
    path: '',
    component: TiposGastosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiposGastosPageRoutingModule {}
