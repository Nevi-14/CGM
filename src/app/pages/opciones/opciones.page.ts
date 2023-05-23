import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { SobrantesPage } from '../sobrantes/sobrantes.page';
import { EstadosCuentaPage } from '../estados-cuenta/estados-cuenta.page';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.page.html',
  styleUrls: ['./opciones.page.scss'],
})
export class OpcionesPage implements OnInit {

  constructor(
    public modalCtrl:ModalController,
  public controlGastosService:ControlGastosService  
  ) { }

  ngOnInit() {
  }
  async estadosDeCuenta(){
    this.modalCtrl.dismiss();
    let modal = await this.modalCtrl.create({
      component: EstadosCuentaPage,

    })

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      
      this.controlGastosService.sincronizarGastos();
    }
  }
  gastosSinanticipo(){
    
    this.controlGastosService.gastoSinAnticipo = true;
    this.controlGastosService.sincronizarGastos();
    this.modalCtrl.dismiss();

  }
  async sobrantes(){
    this.modalCtrl.dismiss();
    let modal = await this.modalCtrl.create({
      component: SobrantesPage,

    })

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      
      this.controlGastosService.sincronizarGastos();
    }
  }

 
}
