import {ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ListaAnticiposPage } from '../lista-anticipos/lista-anticipos.page';
import { EstadosCuentaPage } from '../estados-cuenta/estados-cuenta.page';
import { NuevoGastoSinAnticipoPage } from '../nuevo-gasto-sin-anticipo/nuevo-gasto-sin-anticipo.page';
import { NuevoGastoAnticipoPage } from '../nuevo-gasto-anticipo/nuevo-gasto-anticipo.page';
import { MostrarGastosPage } from '../mostrar-gastos/mostrar-gastos.page';
interface gastos {
  id: number,
  imagen: string,
  tipo: string,
  descripcion: string,
  total: number,
  gastos: any[]
}
@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.page.html',
  styleUrls: ['./mis-gastos.page.scss'],
})
export class MisGastosPage {
  vacio: boolean = true;
  sliderOpts = {
    zoom: false,
    slidesPerView: 4,
    spaceBetween: 2,
    centeredSlides: false,
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
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
  listo: boolean
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
    public controlGastosService: ControlGastosService,
    public gastosSinAnticipoService: GastosSinAnticipoService,
    public gastosConAnticipoService: GastosConAnticipoService,
    public tipoGastosService: TiposGastosService,
    public changeDetector: ChangeDetectorRef

  ) { }



  async ionViewWillEnter() {
    this.cargarGastos()
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
      this.controlGastosService.gastoSinAnticipo = false;
      this.anticiposService.anticipo =  data.anticipo;
      this.anticiposService.vistaAnticipo = data.vistaAnticipo;
      this.gastosConAnticipo()
    }
  }

 
  async cargarGastos() {
    if (this.controlGastosService.gastoSinAnticipo || this.anticiposService.vistaAnticipo) return this.controlGastosService.cargarGRaficos();
    await this.controlGastosService.limpiarDatosIniciales();
  }

  async detalle(tipo: gastos) {
    if (this.controlGastosService.totalColones == 0 && this.controlGastosService.totalDolares == 0 || !this.anticiposService.vistaAnticipo && !this.controlGastosService.gastoSinAnticipo) return this.alertasService.message('SD1 Móvil', 'No hay gastos que consultar!')

    let modal = await this.modalCtrl.create({
      component: MostrarGastosPage,
      mode: 'ios',
      componentProps: {
        tipo: tipo
      }
    })

    modal.present();
    const { data } = await modal.onDidDismiss();

    if (data != undefined) {
      this.cargarGastos()
    }
  }

  async alertaGastosSinAnticipo() {


    const alert = await this.alertCtrl.create({
      header: 'SD1',
      subHeader: 'Se han detectado gastos sin anticipos existentes!..',
      message: '¿Desea cargar los gastos sin anticipo?',
      buttons: [

        {
          text: 'SI',
          role: 'confirm',
          handler: async () => {
            this.controlGastosService.gastoSinAnticipo = true;
            if (this.controlGastosService.gastoSinAnticipo) {
              this.gastosSinAnticipo()
            }
          },
        },
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            this.vacio = true;
            this.controlGastosService.cargarGRaficos();

          },
        }
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();


  }

  async gastosSinAnticipo() {
    this.controlGastosService.labels = [];
    this.controlGastosService.data = [];
    await this.controlGastosService.limpiarDatos();
    await this.controlGastosService.destruirDashboard();
    this.controlGastosService.gastoSinAnticipo = true;
    await this.controlGastosService.sincronizarGastos();
    if(this.controlGastosService.gastos.length > 0){
      this.controlGastosService.labels = [];
      this.controlGastosService.data =[];
    }
    for (let i = 0; i < this.controlGastosService.gastos.length; i++) {

      if (this.controlGastosService.gastos[i].gastos.length > 0) {
        this.controlGastosService.labels.push(this.controlGastosService.gastos[i].descripcion)
        this.controlGastosService.data.push(this.controlGastosService.gastos[i].gastos.length)
      }

      if (i == this.controlGastosService.gastos.length - 1) {
        this.listo = true;
        this.controlGastosService.cargarGRaficos();
      }
    }





  }
  async gastosConAnticipo() {
    let anticipo =  this.anticiposService.anticipo;
    let vistaAnticipo =  this.anticiposService.vistaAnticipo;
    await this.controlGastosService.limpiarDatos();
    await this.controlGastosService.destruirDashboard();
    this.anticiposService.anticipo = anticipo;
    this.anticiposService.vistaAnticipo = vistaAnticipo;
    await  this.controlGastosService.sincronizarGastos();
    if(this.controlGastosService.gastos.length > 0){
      this.controlGastosService.labels = [];
      this.controlGastosService.data =[];
    }

    for (let i = 0; i < this.controlGastosService.gastos.length; i++) {
      if (this.controlGastosService.gastos[i].gastos.length > 0) {
        this.controlGastosService.labels.push(this.controlGastosService.gastos[i].descripcion)
        this.controlGastosService.data.push(this.controlGastosService.gastos[i].gastos.length)
      }
      if (i == this.controlGastosService.gastos.length - 1) {
        this.listo = true;
        this.controlGastosService.cargarGRaficos();
      }
    }





  }


  async nuevoGasto() {
    this.tiposGastosService.tipo = null;
  
    if (this.anticiposService.vistaAnticipo) {
      await this.nuevoGastoAnticipo()
    }
    else {
      await this.nuevoGastoSinAnticipo()

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
     this.gastosConAnticipo();
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
      this.gastosSinAnticipo()
    }
  }


  async estadosDeCuenta() {
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
}
