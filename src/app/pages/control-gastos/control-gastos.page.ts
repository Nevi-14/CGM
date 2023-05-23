import { Component } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { AlertasService } from '../../services/alertas.service';
import { GestionGastosPage } from '../gestion-gastos/gestion-gastos.page';
import { MostrarGastosPage } from '../mostrar-gastos/mostrar-gastos.page';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { Router } from '@angular/router';
import { ListaAnticiposPage } from '../lista-anticipos/lista-anticipos.page';
import { MisGastosPage } from '../mis-gastos/mis-gastos.page';
import { InformacionPage } from '../informacion/informacion.page';
import { TiposGastosPage } from '../tipos-gastos/tipos-gastos.page';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { GastoConAnticipo } from 'src/app/models/gastoConAnticipo';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { OpcionesPage } from '../opciones/opciones.page';
import { NuevoGastoSinAnticipoPage } from '../nuevo-gasto-sin-anticipo/nuevo-gasto-sin-anticipo.page';
import { NuevoGastoAnticipoPage } from '../nuevo-gasto-anticipo/nuevo-gasto-anticipo.page';
interface gastos {
  id: number,
  tipo: string,
  descripcion: string,
  total: number,
  gastos: GastoConAnticipo[]
}
@Component({
  selector: 'app-control-gastos',
  templateUrl: './control-gastos.page.html',
  styleUrls: ['./control-gastos.page.scss'],
})

export class ControlGastosPage {
  sliderOpts = {
    zoom: false,
    slidesPerView: 4,
    spaceBetween: 2,
    centeredSlides: false,
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 2,
        spaceBetween: 5
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      // when window width is >= 940px
      940: {
        slidesPerView: 3,
        spaceBetween: 40
      },

      // when window width is >= 1200px
      1300: {
        slidesPerView: 4,
        spaceBetween: 40
      }
    },
  };
  constructor(
    public usuariosService: UsuariosService,
    public modalCtrl: ModalController,
    public alertasService: AlertasService,
    public popOverCtrl: PopoverController,
    public anticiposService: AnticiposService,
    public router: Router,
    public popOverController: PopoverController,
    public tiposGastosService: TiposGastosService,
    public alertCtrl: AlertController,
    public controlGastosService: ControlGastosService

  ) { }



  ionViewWillEnter() {


    this.controlGastosService.gastos = [];
    this.controlGastosService.syncTiposGastos();
    if (!this.anticiposService.anticipo) {

      return this.alertasService.message('SD1 Móvil', 'Selecciona un anticipo para continuar..')
    }

  }

  async otrasAcciones2() {
    let data1 = 0;
    const alert = await this.alertCtrl.create({
      header: 'SD1 Móvil',
      inputs: [
        {
          label: 'Gastos Sin Anticipo',
          type: 'radio',
          value: '1',
        },
        {
          label: 'Estados De Cuenta',
          type: 'radio',
          value: '2',
        },
        {
          label: 'Sobrantes',
          type: 'radio',
          value: '3',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (data) => {
            console.log('data', data)
            if (data == 1) {
              data1 = data;
              this.limpiarDatosAnticipo();

            }
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

    if (data1 == 1) {
      this.controlGastosService.gastoSinAnticipo = true;
      this.controlGastosService.sincronizarGastos();
    }
  }
  async listaAnticipos() {

    const modal = await this.modalCtrl.create({
      component: ListaAnticiposPage,
      mode: 'ios',
      initialBreakpoint: 0.55,
      breakpoints: [0, 0.25, 0.5, 0.75]
    })

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != undefined) {
      // this.anticiposService.sincronizarGastosConAnticipos();
      this.controlGastosService.sincronizarGastos();
    }
  }
  async otrasAcciones() {

    const modal = await this.modalCtrl.create({
      component: OpcionesPage,
      mode: 'ios',
      initialBreakpoint: 0.55,
      breakpoints: [0, 0.25, 0.5, 0.75]
    })

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data != undefined) {

    }
  }

  limpiarDatosAnticipo() {

    this.controlGastosService.limpiarDatos();
    this.controlGastosService.syncTiposGastos();
    this.alertasService.loadingDissmiss();
  }

  limpiarDatos() {
    this.controlGastosService.gastoSinAnticipo = false;
    this.limpiarDatosAnticipo()
  }
  async informacion() {

    const modal = await this.modalCtrl.create({
      component: InformacionPage,
      mode: 'md'
    })
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != undefined) {
      //this.anticiposService.sincronizarGastosConAnticipos();
      this.controlGastosService.sincronizarGastos();
    }
  }





  cerrarSesion() {
    this.limpiarDatosAnticipo();

    this.usuariosService.usuario = null;
    this.router.navigateByUrl('/');
  }

  async detalle(tipo: gastos) {
    if (!this.controlGastosService.gastoSinAnticipo && !this.anticiposService.vistaAnticipo) return this.alertasService.message('SD1 Móvil', 'No hay gastos que consultar!')

    let modal = await this.modalCtrl.create({
      component: MostrarGastosPage,
      componentProps: {
        tipo: tipo
      }
    })

    modal.present();

  }
  async mostrarGastos() {

    if (!this.controlGastosService.gastoSinAnticipo && !this.anticiposService.vistaAnticipo) return this.alertasService.message('SD1 Móvil', 'No hay gastos que consultar!')
    this.tiposGastosService.tiposGastos = await this.tiposGastosService.getTiposGastos().toPromise();

    let modal = await this.modalCtrl.create({
      component: MisGastosPage,
    })

    modal.present();

  }
  async gestionGastos(estado: string) {
    if (!this.controlGastosService.gastoSinAnticipo && !this.anticiposService.vistaAnticipo) return this.alertasService.message('SD1 Móvil', 'No hay gastos que consultar!')
    this.tiposGastosService.tiposGastos = await this.tiposGastosService.getTiposGastos().toPromise();


    let modal = await this.modalCtrl.create({
      component: GestionGastosPage,
      componentProps: {
        titulo: estado ? 'Liquidaciones' : 'Historial Gastos',
        estado: estado
      }

    })

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {

      this.controlGastosService.sincronizarGastos();
    }

  }

  nuevoGasto(){
     this.tiposGastosService.tipo = null;
    if(this.anticiposService.vistaAnticipo){
      this.nuevoGastoAnticipo()
    }
  else{
    this.nuevoGastoSinAnticipo()
    }
  }

  async nuevoGastoAnticipo() {
  
    if (!this.anticiposService.vistaAnticipo.id) {
      return this.alertasService.message('SD1 Móvil', 'Selecciona un anticipo para continuar..')
    }
    if (this.anticiposService.vistaAnticipo.restante < 0) {
      return this.alertasService.message('SD1 Móvil', 'Fondos Insuficientes!..')
    }
    const modal = await this.modalCtrl.create({
      component: NuevoGastoAnticipoPage,
      componentProps: {
        anticipo: this.anticiposService.vistaAnticipo
      },
      mode: 'ios',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      if (data.check) {

        

      }
    }
  } 
   async nuevoGastoSinAnticipo() {  

    const modal = await this.modalCtrl.create({
      component: NuevoGastoSinAnticipoPage,
      componentProps: {
        anticipo: this.anticiposService.vistaAnticipo
      },
      mode: 'ios',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      if (data.check) {
   

      }
    }
  }



}
