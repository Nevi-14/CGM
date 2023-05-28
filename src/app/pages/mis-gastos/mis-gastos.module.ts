import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisGastosPageRoutingModule } from './mis-gastos-routing.module';

import { MisGastosPage } from './mis-gastos.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisGastosPageRoutingModule,
    ComponentModule,
    PipesModule
  ],
  declarations: [MisGastosPage]
})
export class MisGastosPageModule {}
