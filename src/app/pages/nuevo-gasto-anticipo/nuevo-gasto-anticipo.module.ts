import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoGastoAnticipoPageRoutingModule } from './nuevo-gasto-anticipo-routing.module';

import { NuevoGastoAnticipoPage } from './nuevo-gasto-anticipo.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoGastoAnticipoPageRoutingModule,
    PipesModule,
    ComponentModule
  ],
  declarations: [NuevoGastoAnticipoPage]
})
export class NuevoGastoAnticipoPageModule {}
