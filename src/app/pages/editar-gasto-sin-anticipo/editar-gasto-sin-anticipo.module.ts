import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarGastoSinAnticipoPageRoutingModule } from './editar-gasto-sin-anticipo-routing.module';

import { EditarGastoSinAnticipoPage } from './editar-gasto-sin-anticipo.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarGastoSinAnticipoPageRoutingModule,
    ComponentModule,
    PipesModule
  ],
  declarations: [EditarGastoSinAnticipoPage]
})
export class EditarGastoSinAnticipoPageModule {}
