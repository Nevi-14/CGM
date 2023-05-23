import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NuevoGastoAnticipoPage } from '../nuevo-gasto-anticipo/nuevo-gasto-anticipo.page';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { NuevoGastoSinAnticipoPage } from '../nuevo-gasto-sin-anticipo/nuevo-gasto-sin-anticipo.page';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { TiposGastos } from 'src/app/models/tiposGastos';
import { ControlGastosService } from 'src/app/services/control-gastos.service';

@Component({
  selector: 'app-tipos-gastos',
  templateUrl: './tipos-gastos.page.html',
  styleUrls: ['./tipos-gastos.page.scss'],
})
export class TiposGastosPage implements OnInit {
constructor(
public alertasService: AlertasService,
public modalCtrl:ModalController,
public anticiposService: AnticiposService,
public tiposGastosService:TiposGastosService,
public controlGastosService:ControlGastosService


  ) { }

  ngOnInit() {

  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  retornarValor(tipoGasto:TiposGastos){
 
  this.tiposGastosService.tipo = tipoGasto
  this.modalCtrl.dismiss();
  }

  
  
}
