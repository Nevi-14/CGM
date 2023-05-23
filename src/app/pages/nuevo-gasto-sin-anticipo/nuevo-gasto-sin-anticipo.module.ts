import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoGastoSinAnticipoPageRoutingModule } from './nuevo-gasto-sin-anticipo-routing.module';

import { NuevoGastoSinAnticipoPage } from './nuevo-gasto-sin-anticipo.page';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoGastoSinAnticipoPageRoutingModule
  ],
  declarations: [NuevoGastoSinAnticipoPage]
})
export class NuevoGastoSinAnticipoPageModule {}
