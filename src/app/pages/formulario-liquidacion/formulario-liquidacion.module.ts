import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioLiquidacionPageRoutingModule } from './formulario-liquidacion-routing.module';

import { FormularioLiquidacionPage } from './formulario-liquidacion.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormularioLiquidacionPageRoutingModule,
    ComponentModule,
    PipesModule
  ],
  declarations: [FormularioLiquidacionPage]
})
export class FormularioLiquidacionPageModule {}
