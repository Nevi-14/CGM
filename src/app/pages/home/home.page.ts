import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { OC, OCLineas } from 'src/app/models/definiciones';
import { InicioSesionPage } from '../inicio-sesion/inicio-sesion.page';
import { OrdenesCompraPage } from '../ordenes-compra/ordenes-compra.page';
import { Router } from '@angular/router';
import { ControlGastosPage } from '../control-gastos/control-gastos.page';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { OrdenesDeCompraService } from 'src/app/services/ordenes-de-compra.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  nombre = '';

  constructor( public  usuariosService:UsuariosService,
               private modalCtrl: ModalController,
               private actSheetCtrl: ActionSheetController,
               public router: Router,
              public ordernesDeComprasService:OrdenesDeCompraService
               ) {}

  ngOnInit(): void {
    this.nombre = this.usuariosService.usuario.nombre;
    this.consultarOC();
    //this.consultarPrueba();
  }

  async login(){
    if (this.usuariosService.usuario.usuario === ''){
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
          this.nombre = this.usuariosService.usuario.nombre;
          this.consultarOC();
        }
      }
    } else {
      const actionSheet = await this.actSheetCtrl.create({
        header: 'Login',
        mode: 'ios',
        cssClass: 'left-align-buttons',
        buttons: [{
          text: 'Cerrar Sessión',
          role: 'destructive',
          icon: 'log-out',
          id: 'delete-button',
          handler: () => {
            console.log('Delete clicked');
            this.logout();
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
    
    this.ordernesDeComprasService.ocPendientes = [];
    this.ordernesDeComprasService.cantidadOCs = 0;
    this.usuariosService.usuario.clave = '';
    this.usuariosService.usuario.usuario=null;
    this.usuariosService.usuario.nombre=null;
    this.usuariosService.usuario.clave=null;
    this.usuariosService.usuario.cia=null;
   // this.usuariosService.usuario.empleado = '';
    //this.usuariosService.usuario.email = '';
    //this.usuariosService.usuario.nombre = '';
   // this.usuariosService.usuario.rol = '';
    //this.usuariosService.usuario.usuario = '';
    this.nombre = '';
    this.usuariosService.guardarUsuario();
    this.router.navigateByUrl('/');
  }

  consultarOC(){
    if (this.usuariosService.usuario.usuario !== ''){
      this.usuariosService.presentaLoading('Consultando ordernesDeComprasService...');
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
                        x.pais, x.fechaOC, x.fechA_REQUERIDA, x.fechA_COTIZACION, x.porC_DESCUENTO, x.montO_DESCUENTO, x.totaL_MERCADERIA, x.totaL_IMPUESTO1, x.montO_FLETE,
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

  async aprobarOCs(){

    return
    if (this.usuariosService.usuario.usuario !== ''){
      if (this.ordernesDeComprasService.ocPendientes.length > 0){
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

  async viaticos(){
    if (this.usuariosService.usuario.usuario !== ''){
      const modal = await this.modalCtrl.create({
        component: ControlGastosPage,
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

}
