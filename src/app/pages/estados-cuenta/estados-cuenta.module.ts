import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadosCuentaPageRoutingModule } from './estados-cuenta-routing.module';

import { EstadosCuentaPage } from './estados-cuenta.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadosCuentaPageRoutingModule,
    ComponentModule,
    PipesModule
  ],
  declarations: [EstadosCuentaPage]
})
export class EstadosCuentaPageModule {}
