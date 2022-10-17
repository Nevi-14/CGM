import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OcDetallesPageRoutingModule } from './oc-detalles-routing.module';

import { OcDetallesPage } from './oc-detalles.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OcDetallesPageRoutingModule,
    PipesModule
  ],
  declarations: [OcDetallesPage]
})
export class OcDetallesPageModule {}
