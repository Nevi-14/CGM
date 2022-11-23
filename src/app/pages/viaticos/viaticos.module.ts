import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViaticosPageRoutingModule } from './viaticos-routing.module';

import { ViaticosPage } from './viaticos.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViaticosPageRoutingModule,
    PipesModule
  ],
  declarations: [ViaticosPage]
})
export class ViaticosPageModule {}
