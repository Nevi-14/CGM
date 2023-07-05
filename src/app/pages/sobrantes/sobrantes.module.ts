import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SobrantesPageRoutingModule } from './sobrantes-routing.module';

import { SobrantesPage } from './sobrantes.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SobrantesPageRoutingModule,
    ComponentModule
  ],
  declarations: [SobrantesPage]
})
export class SobrantesPageModule {}
