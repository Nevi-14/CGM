import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OC } from 'src/app/models/definiciones';
import { BdService } from 'src/app/services/bd.service';

@Component({
  selector: 'app-oc-detalles',
  templateUrl: './oc-detalles.page.html',
  styleUrls: ['./oc-detalles.page.scss'],
})
export class OcDetallesPage implements OnInit {

  @Input() i: number;
  etiqueta = '';
  oc: OC;

  constructor( public bd: BdService,
               private modalCtrl: ModalController ) { }

  ngOnInit() {
    this.etiqueta = this.bd.ocPendientes[this.i].ORDEN_COMPRA;
    this.oc = this.bd.ocPendientes[this.i];
  }

  regresar(){
    this.modalCtrl.dismiss();
  }

}
