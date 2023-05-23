import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarGastoSinAnticipoPageRoutingModule } from './editar-gasto-sin-anticipo-routing.module';

import { EditarGastoSinAnticipoPage } from './editar-gasto-sin-anticipo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarGastoSinAnticipoPageRoutingModule
  ],
  declarations: [EditarGastoSinAnticipoPage]
})
export class EditarGastoSinAnticipoPageModule {}
