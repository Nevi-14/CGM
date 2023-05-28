import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiquidacionesPageRoutingModule } from './liquidaciones-routing.module';

import { LiquidacionesPage } from './liquidaciones.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiquidacionesPageRoutingModule,
    ComponentModule,
    PipesModule
  ],
  declarations: [LiquidacionesPage]
})
export class LiquidacionesPageModule {}
