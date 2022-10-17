import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenesCompraPageRoutingModule } from './ordenes-compra-routing.module';

import { OrdenesCompraPage } from './ordenes-compra.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenesCompraPageRoutingModule,
    PipesModule
  ],
  declarations: [OrdenesCompraPage]
})
export class OrdenesCompraPageModule {}
