import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { OC, OCLineas } from 'src/app/models/definiciones';
import { BdService } from 'src/app/services/bd.service';
import { D1Service } from 'src/app/services/d1.service';
import { InicioSesionPage } from '../inicio-sesion/inicio-sesion.page';
import { OrdenesCompraPage } from '../ordenes-compra/ordenes-compra.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  nombre = '';

  constructor( public  d1: D1Service,
               public bd: BdService,
               private modalCtrl: ModalController,
               private actSheetCtrl: ActionSheetController ) {}

  ngOnInit(): void {
    this.nombre = this.d1.usuario.nombre;
    this.consultarOC();
    //this.consultarPrueba();
  }

  async login(){
    if (this.d1.usuario.usuario === ''){
      console.log('Abriendo el modal')
      const modal = await this.modalCtrl.create({
        component: InicioSesionPage,
        cssClass:  'modal-view',
        mode:      'ios'
      });
      await modal.present();
      const {data} = await modal.onDidDismiss();
      if ( data !== undefined ){
        if ( data.Aut ){
          console.log(data);
          this.nombre = this.d1.usuario.nombre;
          this.consultarOC();
        }
      }
    } else {
      const actionSheet = await this.actSheetCtrl.create({
        header: 'Login',
        mode: 'ios',
        cssClass: 'my-custom-class',
        buttons: [{
          text: 'Log Out',
          role: 'destructive',
          icon: 'trash',
          id: 'delete-button',
          handler: () => {
            console.log('Delete clicked');
            this.logout();
          }
        }, {
          text: 'Nuevo Usuario',
          icon: 'share',
          handler: () => {
            console.log('Share clicked');
            this.logout();
            this.login();
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();
  
      const { role, data } = await actionSheet.onDidDismiss();
      console.log('onDidDismiss resolved with role and data', role, data);
    }
  }

  logout(){
    this.bd.ocPendientes = [];
    this.bd.cantidadOCs = 0;
    this.d1.usuario.clave = '';
    this.d1.usuario.empleado = '';
    this.d1.usuario.email = '';
    this.d1.usuario.nombre = '';
    this.d1.usuario.rol = '';
    this.d1.usuario.usuario = '';
    this.nombre = '';
    this.d1.guardarUsuario();
  }

  consultarOC(){
    if (this.d1.usuario.usuario !== ''){
      this.d1.presentaLoading('Consultando BD...');
      this.bd.getOCAprobLineas(this.d1.usuario.usuario).subscribe(
        resp => {
          this.d1.loadingDissmiss();
          this.bd.ocLineas = resp.slice(0);
          this.cargarOCs();
          this.bd.cantidadOCs = this.bd.ocPendientes.length; 
        }, error => {
          this.d1.loadingDissmiss();
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

    this.bd.ocLineas.forEach(x => {
      if (idOC !== x.ordeN_COMPRA){
        idOC = x.ordeN_COMPRA;
        ocItem = new OC(x.ordeN_COMPRA, x.usuario, x.estatus, x.fechaOC, x.usuarioOC, x.tipO_ORDEN, x.desc_Tipo_Orden, x.departamento, x.condicioN_PAGO, x.moneda,
                        x.pais, x.fechaOC, x.fechA_REQUERIDA, x.fechA_COTIZACION, x.porC_DESCUENTO, x.montO_DESCUENTO, x.totaL_MERCADERIA, x.totaL_IMPUESTO1, x.montO_FLETE,
                        x.montO_SEGURO, 0, x.montO_ANTICIPO, x.totaL_A_COMPRAR);
        ordenesCompra.push(ocItem);
        i++;
      }
      oclinea = new OCLineas(x.articulo, x.descripcion, x.cantidaD_ORDENADA, x.preciO_UNITARIO, x.impuestO1, x.porcDescuentoLinea, x.descuento,
                             x.ordeN_COMPRA_LINEA);
      ordenesCompra[i].lineas.push(oclinea);
    });
    this.bd.ocPendientes = ordenesCompra.slice(0);
    console.log(this.bd.ocPendientes);
  }

  async aprobarOCs(){
    if (this.d1.usuario.usuario !== ''){
      if (this.bd.ocPendientes.length > 0){
        const modal = await this.modalCtrl.create({
          component: OrdenesCompraPage,
          cssClass:  'modal-view',
          mode:      'ios'
        });
        await modal.present();
        const {data} = await modal.onDidDismiss();
        if ( data !== undefined ){
          console.log(data);
          this.consultarOC();
        }
      } else {
        this.consultarOC();
      }
    }
  }

}
