import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PiePaginaComponent } from './pie-pagina/pie-pagina.component';
import { NgChartsModule } from 'ng2-charts';
import { RobotMessageComponent } from './robot-message/robot-message.component';
import { InputComponent } from './input/input.component';
import { ButtonComponent } from './button/button.component';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { SelectComponent } from './select/select.component';
import { PiePaginaInicioComponent } from './pie-pagina-inicio/pie-pagina-inicio.component';



@NgModule({
  declarations: [
  PiePaginaComponent,
  RobotMessageComponent,
  InputComponent,
  ButtonComponent,
  IconButtonComponent,
  EncabezadoComponent,
  SelectComponent,
  PiePaginaInicioComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    NgChartsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    PiePaginaComponent,
    RobotMessageComponent,
    InputComponent,
    ButtonComponent,
    IconButtonComponent,
    EncabezadoComponent,
    SelectComponent,
    PiePaginaInicioComponent
  ],

})
export class ComponentModule { }

