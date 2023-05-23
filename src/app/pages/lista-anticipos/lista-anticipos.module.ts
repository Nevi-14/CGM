import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaAnticiposPageRoutingModule } from './lista-anticipos-routing.module';

import { ListaAnticiposPage } from './lista-anticipos.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaAnticiposPageRoutingModule,
    PipesModule
  ],
  declarations: [ListaAnticiposPage]
})
export class ListaAnticiposPageModule {}
