import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiltroHistorialPageRoutingModule } from './filtro-historial-routing.module';

import { FiltroHistorialPage } from './filtro-historial.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltroHistorialPageRoutingModule,
    ComponentModule
  ],
  declarations: [FiltroHistorialPage]
})
export class FiltroHistorialPageModule {}
