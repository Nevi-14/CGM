import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarGastoPageRoutingModule } from './editar-gasto-routing.module';

import { EditarGastoPage } from './editar-gasto.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarGastoPageRoutingModule,
    ComponentModule
  ],
  declarations: [EditarGastoPage]
})
export class EditarGastoPageModule {}
