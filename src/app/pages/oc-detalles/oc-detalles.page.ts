import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OC } from 'src/app/models/definiciones';
import { OrdenesDeCompraService } from 'src/app/services/ordenes-de-compra.service';


@Component({
  selector: 'app-oc-detalles',
  templateUrl: './oc-detalles.page.html',
  styleUrls: ['./oc-detalles.page.scss'],
})
export class OcDetallesPage implements OnInit {

  @Input() i: number;
  etiqueta = '';
  oc: OC;

  constructor( public ordenesDeCompraService:OrdenesDeCompraService,
               private modalCtrl: ModalController ) { }

  ngOnInit() {
    this.etiqueta = this.ordenesDeCompraService.ocPendientes[this.i].ORDEN_COMPRA;
    this.oc = this.ordenesDeCompraService.ocPendientes[this.i];
  }

  regresar(){
    this.modalCtrl.dismiss();
  }

}
