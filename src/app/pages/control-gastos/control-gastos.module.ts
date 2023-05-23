import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlGastosPageRoutingModule } from './control-gastos-routing.module';

import { ControlGastosPage } from './control-gastos.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlGastosPageRoutingModule,
    PipesModule,
    ComponentModule
  ],
  declarations: [ControlGastosPage]
})
export class ControlGastosPageModule {}
