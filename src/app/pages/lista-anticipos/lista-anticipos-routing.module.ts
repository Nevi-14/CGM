import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaAnticiposPage } from './lista-anticipos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaAnticiposPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaAnticiposPageRoutingModule {}
