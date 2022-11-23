import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BdService } from 'src/app/services/bd.service';
import { D1Service } from 'src/app/services/d1.service';
import { TiposGastos, ViLineas } from '../../models/definiciones';


@Component({
  selector: 'app-nuevo-gasto',
  templateUrl: './nuevo-gasto.page.html',
  styleUrls: ['./nuevo-gasto.page.scss'],
})
export class NuevoGastoPage implements OnInit {

  nuevoGasto = {
    tipoGasto: '',
    fecha: new Date(),
    proveedor: '',
    idProveedor: '',
    factura: '',
    monto: 0
  }
  tiposGastos: TiposGastos[] = [];

  constructor( private d1: D1Service,
               private bd: BdService,
               private modalCtrl: ModalController) { }

  ngOnInit() {
    this.tiposGastos = JSON.parse(localStorage.getItem('D1tiposGasto')) || [];
  }

  salvar(){
    const i = this.tiposGastos.findIndex( x => x.descripcion === this.nuevoGasto.tipoGasto );
    const gasto = new ViLineas(this.tiposGastos[i].tipoGasto, this.nuevoGasto.tipoGasto, this.nuevoGasto.fecha, this.nuevoGasto.monto, this.nuevoGasto.idProveedor,
                                this.nuevoGasto.proveedor, this.nuevoGasto.factura );
    console.log('Salvando');
    this.modalCtrl.dismiss({'check': true, gasto});
  }

  regresar(){
    this.modalCtrl.dismiss({'check': false});
  }

}
