import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoGastoSinAnticipoPageRoutingModule } from './nuevo-gasto-sin-anticipo-routing.module';

import { NuevoGastoSinAnticipoPage } from './nuevo-gasto-sin-anticipo.page';
import { ComponentModule } from 'src/app/components/component.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoGastoSinAnticipoPageRoutingModule,
    ComponentModule
  ],
  declarations: [NuevoGastoSinAnticipoPage]
})
export class NuevoGastoSinAnticipoPageModule {}
