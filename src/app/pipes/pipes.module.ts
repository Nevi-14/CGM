import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ColonesPipe } from './colones.pipe';
import { FiltroPipe } from './filtro.pipe';



@NgModule({
  declarations: [ColonesPipe,FiltroPipe],
  exports: [ColonesPipe, DatePipe,FiltroPipe],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
