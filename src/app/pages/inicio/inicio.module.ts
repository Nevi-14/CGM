import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioPageRoutingModule } from './inicio-routing.module';

import { InicioPage } from './inicio.page';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    ComponentModule,
    PipesModule,
     NgChartsModule
  ],
  declarations: [InicioPage]
})
export class InicioPageModule {}
