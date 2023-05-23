import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TiposGastosPageRoutingModule } from './tipos-gastos-routing.module';

import { TiposGastosPage } from './tipos-gastos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TiposGastosPageRoutingModule
  ],
  declarations: [TiposGastosPage]
})
export class TiposGastosPageModule {}
