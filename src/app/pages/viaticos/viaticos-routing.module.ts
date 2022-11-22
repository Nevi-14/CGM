import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViaticosPage } from './viaticos.page';

const routes: Routes = [
  {
    path: '',
    component: ViaticosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViaticosPageRoutingModule {}
