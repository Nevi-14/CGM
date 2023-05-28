import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarGastoSinAnticipoPageRoutingModule } from './editar-gasto-sin-anticipo-routing.module';

import { EditarGastoSinAnticipoPage } from './editar-gasto-sin-anticipo.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarGastoSinAnticipoPageRoutingModule,
    ComponentModule
  ],
  declarations: [EditarGastoSinAnticipoPage]
})
export class EditarGastoSinAnticipoPageModule {}
