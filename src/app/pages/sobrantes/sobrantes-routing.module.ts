import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SobrantesPage } from './sobrantes.page';

const routes: Routes = [
  {
    path: '',
    component: SobrantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SobrantesPageRoutingModule {}
