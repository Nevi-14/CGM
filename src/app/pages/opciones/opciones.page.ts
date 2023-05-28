import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { SobrantesPage } from '../sobrantes/sobrantes.page';
import { EstadosCuentaPage } from '../estados-cuenta/estados-cuenta.page';
import { AnticiposService } from 'src/app/services/anticipos.service';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.page.html',
  styleUrls: ['./opciones.page.scss'],
})
export class OpcionesPage implements OnInit {

  constructor(
    public modalCtrl:ModalController,
  public controlGastosService:ControlGastosService,
  public anticiposService:AnticiposService
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
    this.anticiposService.vistaAnticipo = null;
    this.controlGastosService.gastoSinAnticipo = true;
    this.modalCtrl.dismiss(true);

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
