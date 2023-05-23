import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ModalController } from '@ionic/angular';
import { OC, OCAprobBD, OCLineas } from 'src/app/models/definiciones';
import { OcDetallesPage } from '../oc-detalles/oc-detalles.page';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { OrdenesDeCompraService } from 'src/app/services/ordenes-de-compra.service';

@Component({
  selector: 'app-ordenes-compra',
  templateUrl: './ordenes-compra.page.html',
  styleUrls: ['./ordenes-compra.page.scss'],
})
export class OrdenesCompraPage implements OnInit {

  @ViewChild('myList') ionList: IonList;
  seActualizo = false;
  OCAprob     = true;
  etiqueta    = 'Por Aprobar';

  constructor( 
               private usuariosService:UsuariosService,
               private modalCtrl: ModalController,
               private alertCtrl: AlertController,
               public ordernesDeComprasService:OrdenesDeCompraService
               ) { }

  ngOnInit() {
  }

  regresar(){
    if (this.seActualizo){ 
      this.modalCtrl.dismiss({'check': true});
    } else {
      this.modalCtrl.dismiss({'check': false});
    }
  }

  cambioTipoOC(){
    console.log('Toggle: ', this.OCAprob);
    if (this.OCAprob){
      this.etiqueta = 'Transito';
      this.OCAprob = false;
      this.consultarOCTrans();
    } else {
      this.etiqueta = 'Por Aprobar';
      this.OCAprob = true;
      this.consultarOCAprob();
    }
  }

  consultarOCAprob(){
    if (this.usuariosService.usuario.usuario !== ''){
      this.usuariosService.presentaLoading('Consultando BD...');
      this.ordernesDeComprasService.getOCAprobLineas(this.usuariosService.usuario.usuario).subscribe(
        resp => {
          this.usuariosService.loadingDissmiss();
          this.ordernesDeComprasService.ocLineas = resp.slice(0);
          this.cargarOCs();
          this.ordernesDeComprasService.cantidadOCs = this.ordernesDeComprasService.ocPendientes.length; 
        }, error => {
          this.usuariosService.loadingDissmiss();
          console.log('Error consultando las OC...', error.message);
        }
      )
    }
  }

  consultarOCTrans(){
    if (this.usuariosService.usuario.usuario !== ''){
      this.usuariosService.presentaLoading('Consultando BD...');
      this.ordernesDeComprasService.getOCTransLineas(this.usuariosService.usuario.usuario).subscribe(
        resp => {
          this.usuariosService.loadingDissmiss();
          this.ordernesDeComprasService.ocLineas = resp.slice(0);
          this.cargarOCs();
          this.ordernesDeComprasService.cantidadOCs = this.ordernesDeComprasService.ocPendientes.length; 
        }, error => {
          this.usuariosService.loadingDissmiss();
          console.log('Error consultando las OC...', error.message);
        }
      )
    }
  }

  cargarOCs(){
    let idOC = '';
    let i    = -1;
    let ordenesCompra: OC[] = [];
    let ocItem:  OC;
    let oclinea: OCLineas;

    this.ordernesDeComprasService.ocLineas.forEach(x => {
      if (idOC !== x.ordeN_COMPRA){
        idOC = x.ordeN_COMPRA;
        ocItem = new OC(x.ordeN_COMPRA, x.usuario, x.estatus, x.fechaOC, x.usuarioOC, x.tipO_ORDEN, x.desc_Tipo_Orden, x.departamento, x.condicioN_PAGO, x.moneda,
                        x.pais, x.fecha, x.fechA_REQUERIDA, x.fechA_COTIZACION, x.porC_DESCUENTO, x.montO_DESCUENTO, x.totaL_MERCADERIA, x.totaL_IMPUESTO1, x.montO_FLETE,
                        x.montO_SEGURO, 0, x.montO_ANTICIPO, x.totaL_A_COMPRAR);
        ordenesCompra.push(ocItem);
        i++;
      }
      oclinea = new OCLineas(x.articulo, x.descripcion, x.cantidaD_ORDENADA, x.preciO_UNITARIO, x.impuestO1, x.porcDescuentoLinea, x.descuento,
                             x.ordeN_COMPRA_LINEA);
      ordenesCompra[i].lineas.push(oclinea);
    });
    this.ordernesDeComprasService.ocPendientes = ordenesCompra.slice(0);
    console.log(this.ordernesDeComprasService.ocPendientes);
  }

  async abrirDetalles(i: number){
    const modal = await this.modalCtrl.create({
      component: OcDetallesPage,
      componentProps: { i },
      cssClass:  'modal-view',
      mode:      'ios'
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if ( data !== undefined ){
      
    }
  }

  async aprobarOC( i: number, accion: boolean){    // accion = true aprueba la OC; de lo contrario no la aprueba
    if (accion){ 
      const alert = await this.alertCtrl.create({
        header: 'Desea Aprobar la OC',
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
              this.ordernesDeComprasService.ocPendientes[i].Estatus = 'E';      // Orden de compra pasa a en Transito.
              this.actualizarOC(i);
            },
          },
        ],
      });
      await alert.present();
      this.ionList.closeSlidingItems();

    } else {
      const alert2 = await this.alertCtrl.create({
        header: 'NO Aprueba la OC!!!',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Acción de rechazar cancelada');
            },
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              this.ordernesDeComprasService.ocPendientes[i].Estatus = 'C';      // Orden de compra pasa a estado NO Aprobada.
              this.actualizarOC(i);
            },
          },
        ],
      });
      await alert2.present();
      this.ionList.closeSlidingItems();
    }
  }

  actualizarOC( i: number ){
    console.log(this.ordernesDeComprasService.ocPendientes);
    let ocAprob: OCAprobBD = {
      ORDEN_COMPRA: this.ordernesDeComprasService.ocPendientes[i].ORDEN_COMPRA,
      Usuario:      this.ordernesDeComprasService.ocPendientes[i].Usuario,
      Estatus:      this.ordernesDeComprasService.ocPendientes[i].Estatus,
      Fecha:        new Date(),
    }

    this.usuariosService.presentaLoading('Actualizando OC');
    this.ordernesDeComprasService.putOCAprob(ocAprob).subscribe(
      resp => {
        this.usuariosService.loadingDissmiss();
        console.log('OC Actualizada')
        this.seActualizo = true;
      }, error => {
        this.usuariosService.loadingDissmiss();
        console.log('ERROR actualizando OC', error.message)
        
      }
    )
  }

}
