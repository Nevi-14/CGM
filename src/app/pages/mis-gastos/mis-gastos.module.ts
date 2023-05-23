import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisGastosPageRoutingModule } from './mis-gastos-routing.module';

import { MisGastosPage } from './mis-gastos.page';
import { NgChartsModule } from 'ng2-charts';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisGastosPageRoutingModule,
    NgChartsModule,
    PipesModule,
    ComponentModule
  ],
  declarations: [MisGastosPage]
})
export class MisGastosPageModule {}
