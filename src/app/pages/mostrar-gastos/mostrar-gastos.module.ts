import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MostrarGastosPageRoutingModule } from './mostrar-gastos-routing.module';

import { MostrarGastosPage } from './mostrar-gastos.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from '../../components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MostrarGastosPageRoutingModule,
    PipesModule,
    ComponentModule
  ],
  declarations: [MostrarGastosPage]
})
export class MostrarGastosPageModule {}
