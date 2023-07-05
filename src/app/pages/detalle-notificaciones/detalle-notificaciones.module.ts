import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleNotificacionesPageRoutingModule } from './detalle-notificaciones-routing.module';

import { DetalleNotificacionesPage } from './detalle-notificaciones.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleNotificacionesPageRoutingModule,
    ComponentModule
  ],
  declarations: [DetalleNotificacionesPage]
})
export class DetalleNotificacionesPageModule {}
