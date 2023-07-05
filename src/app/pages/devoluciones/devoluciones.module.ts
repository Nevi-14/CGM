import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevolucionesPageRoutingModule } from './devoluciones-routing.module';

import { DevolucionesPage } from './devoluciones.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevolucionesPageRoutingModule,
    ComponentModule
  ],
  declarations: [DevolucionesPage]
})
export class DevolucionesPageModule {}
