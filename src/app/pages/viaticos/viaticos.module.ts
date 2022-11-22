import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViaticosPageRoutingModule } from './viaticos-routing.module';

import { ViaticosPage } from './viaticos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViaticosPageRoutingModule
  ],
  declarations: [ViaticosPage]
})
export class ViaticosPageModule {}
