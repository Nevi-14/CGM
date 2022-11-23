import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { LineaGasto, TiposGastos, Viaticos, ViLineas } from 'src/app/models/definiciones';
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
  viaticos:    Viaticos[] = [];
  total:       number = 0;

  constructor( private d1: D1Service,
               private bd: BdService,
               private modalCtrl: ModalController,
               private alertCtrl: AlertController ) { }

  ngOnInit() {
    let viaticosAux: Viaticos[] = [];

    this.syncTiposGastos();
    viaticosAux = JSON.parse(localStorage.getItem('SD1Viaticos')) || [];
    if (viaticosAux.length > 0){
      this.viaticos = viaticosAux.slice(0);
      this.viaticos.forEach( x => {
        this.total += x.MONTO;
      })
    }
  }

  regresar(){
    this.modalCtrl.dismiss();
  }

  syncTiposGastos(){
    this.bd.getTiposGastos().subscribe(
      resp => {
        console.log('Cargados los Tipos de Gastos')
        this.tiposGastos = resp.slice(0);
        localStorage.setItem('D1tiposGasto', JSON.stringify(this.tiposGastos));
      }
    ), error => {
      this.d1.presentAlert('Error Sincronizando', 'No se ha podido leer los tipos de gastos.!!!');
    }
  }

  async nuevoGasto(){
    let gasto: ViLineas;

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
      if (data.check){
        console.log(data.gasto);
        gasto = data.gasto;
        const i = this.viaticos.findIndex( x => x.TIPO_GASTO === gasto.LINEA);
        if ( i < 0){
          const linea = new ViLineas( '1', gasto.DESCRIPCION, gasto.FECHA, gasto.MONTO, gasto.PROVEEDOR, gasto.NOMBRE, gasto.FACTURA);
          const viatico = new Viaticos( gasto.LINEA, gasto.DESCRIPCION, null, gasto.MONTO, this.d1.usuario.usuario);
          viatico.lineas.push( linea );
          this.viaticos.push( viatico );
          this.total += gasto.MONTO
        } else {
          const linea = new ViLineas( '1', gasto.DESCRIPCION, gasto.FECHA, gasto.MONTO, gasto.PROVEEDOR, gasto.NOMBRE, gasto.FACTURA);
          this.viaticos[i].lineas.push( linea );
          this.viaticos[i].MONTO += linea.MONTO;
          this.total += gasto.MONTO;
        }
        console.log(this.viaticos);
        localStorage.setItem('SD1Viaticos', JSON.stringify(this.viaticos));
      }
    }
  }

  async transmitir(){
    if (this.viaticos.length > 0){ 
      const alert = await this.alertCtrl.create({
        header: 'Desea liquidar los viáticos?',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Acción de aprobar cancelada');
            },
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              this.liquidar();
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.d1.presentAlert('Liquidación', 'No hay gastos que liquidar...!!!');
    }
  }

  liquidar(){
    let lineas: LineaGasto[] = [];
    let linea: LineaGasto;

    this.d1.presentaLoading('Espere por favor...');
    if ( this.viaticos.length > 0){
      this.viaticos.forEach( x => {
        x.lineas.forEach( y => {
          linea = new LineaGasto( y.FECHA, x.USUARIO, y.FACTURA, '001-001', '001-01-01-001', x.TIPO_GASTO, x.DESCRIPCION, y.MONTO, 'ND', 'N');
          lineas.push(linea);
        });
      });
      this.bd.post1LinGasto( lineas ).subscribe(
        resp => {
          this.d1.loadingDissmiss();
          this.limpiarDatos();
          this.d1.presentAlert('Sincronizando', 'Liquidación Exitosa.');
        }, error => {
          this.d1.loadingDissmiss();
          this.d1.presentAlert('Sincronizando', 'ERROR sincronizando con la BD...!!!');
        }
      )
    } else {
      this.d1.presentAlert('Liquidación', 'No hay gastos que liquidar...!!!');
    }
  }

  limpiarDatos(){
    this.viaticos = [];
    this.total = 0;
    localStorage.removeItem('SD1Viaticos');
  }


}
