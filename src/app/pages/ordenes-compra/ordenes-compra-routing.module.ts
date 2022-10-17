import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenesCompraPage } from './ordenes-compra.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenesCompraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenesCompraPageRoutingModule {}
