import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionGastosPageRoutingModule } from './gestion-gastos-routing.module';

import { GestionGastosPage } from './gestion-gastos.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionGastosPageRoutingModule,
    PipesModule,
    ComponentModule
  ],
  declarations: [GestionGastosPage]
})
export class GestionGastosPageModule {}
