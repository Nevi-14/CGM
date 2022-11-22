import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TiposGastos } from 'src/app/models/definiciones';
import { BdService } from 'src/app/services/bd.service';
import { D1Service } from 'src/app/services/d1.service';
import { NuevoGastoPage } from '../nuevo-gasto/nuevo-gasto.page';

@Component({
  selector: 'app-viaticos',
  templateUrl: './viaticos.page.html',
  styleUrls: ['./viaticos.page.scss'],
})
export class ViaticosPage implements OnInit {

  tiposGastos: TiposGastos[] = [];

  constructor( private d1: D1Service,
               private bd: BdService,
               private modalCtrl: ModalController ) { }

  ngOnInit() {
  }

  regresar(){
    this.modalCtrl.dismiss();
  }

  syncTiposGastos(){
    this.bd.getTiposGastos().subscribe(
      resp => {
        console.log('Cargados los Tipos de Gastos')
        this.tiposGastos = resp.slice(0);
      }
    ), error => {
      this.d1.presentAlert('Error Sincronizando', 'No se ha podido leer los tipos de gastos.!!!');
    }
  }

  async nuevoGasto(){
    this.syncTiposGastos();
    console.log('Nuevo Gsto');
    const modal = await this.modalCtrl.create({
      component: NuevoGastoPage,
      cssClass:  'modal-view',
      mode:      'ios'
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if ( data !== undefined ){
      console.log(data);
      //this.consultarOC();
    }
  }


}
