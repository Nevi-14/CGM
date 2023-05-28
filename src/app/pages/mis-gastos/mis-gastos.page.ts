import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Chart } from 'chart.js';
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
export class MisGastosPage implements  AfterViewInit{
vacio:boolean = true;
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
  listo:boolean
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
    public gastosSinAnticipoService:GastosSinAnticipoService,
    public gastosConAnticipoService:GastosConAnticipoService,
    public tipoGastosService:TiposGastosService,
    public changeDetector:ChangeDetectorRef

  ) { }


  ngAfterViewInit() {
    
     }

     
  async ionViewWillEnter() {
    this.controlGastosService.destruirDashboard();
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
  // await  this.controlGastosService.syncTiposGastos();
     this.gastosConAnticipo()
    }
  }
  limpiarGraficos(){
    this.controlGastosService.gastoSinAnticipo = null;
    this.controlGastosService.total = 0
    this.controlGastosService.labels = [];
    this.controlGastosService.data = [];
    this.controlGastosService.labels = ['No hay gastos que mostrar!...'];
    this.controlGastosService.data = [0];
    this.anticiposService.vistaAnticipo = null;
    this.anticiposService.anticipo = null;
    this.cargarGastos();
  }
 async cargarGastos(){
if(this.controlGastosService.gastoSinAnticipo || this.anticiposService.vistaAnticipo){
 
  this.controlGastosService.cargarGRaficos();
  return

}
 
//this.anticiposService.vistaAnticipo = null;
this.controlGastosService.limpiarDatos();
await this.controlGastosService.syncTiposGastos();
this.controlGastosService.cargarGRaficos();
return




return
     this.listo = false;
     //this.alertasService.presentaLoading('Cargando Datos...')
     if(this.anticiposService.vistaAnticipo){
       this.vacio = false;
     this.gastosConAnticipo();
     }else{
       this.vacio = true;
       this.alertasService.loadingDissmiss();
       let gastosSinAnticipo = await     this.gastosSinAnticipoService.sincronizarGastosSinAnticipos( this.usuariosService.usuario.usuario, this.controlGastosService.fechaInicioMes, this.controlGastosService.fechaFinMes)
  
       if(gastosSinAnticipo.length>0) {
     
      if(this.vacio){
       this.vacio = false;
       return this.alertaGastosSinAnticipo();
      }else{
       this.gastosSinAnticipo()
      }
 
       } 
       this.alertasService.message('SD1', 'Lo sentimos no se ha registrado ningun gasto, selecciona un anticipo o crear un gasto sin anticipo!..')
       //this.cargarGraficosSinGastos();
     }
 
   }

   async detalle(tipo: gastos) {
    if (this.controlGastosService.total == 0   || !this.anticiposService.vistaAnticipo) return this.alertasService.message('SD1 Móvil', 'No hay gastos que consultar!')

    let modal = await this.modalCtrl.create({
      component: MostrarGastosPage,
      mode:'ios',
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
 
   async alertaGastosSinAnticipo(){
 
    const alert = await this.alertCtrl.create({
      header: 'SD1',
      subHeader:'Se han detectado gastos sin anticipos existentes!..',
      message:'¿Desea cargar los gastos sin anticipo?',
      buttons: [
    
        {
          text: 'SI',
          role: 'confirm',
          handler: async () => {
            this.controlGastosService.gastoSinAnticipo = true;
            if(this.controlGastosService.gastoSinAnticipo){
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

async gastosConAnticipo2(){
 
await  this.controlGastosService.sincronizarGastos();
  this.gastosConAnticipoService.getUsuarioGastosConAnticipoEstadoToPromise(this.anticiposService.vistaAnticipo.iD_LINEA, "").then(resp =>{
    console.log('gastos resp', resp)
    this.alertasService.loadingDissmiss();
  
    for(let i =0; i < resp.length ; i++){
 
      console.log( resp[i],' resp[i]')
         this.controlGastosService.labels.push(this.controlGastosService.gastos[i].descripcion)
        this.controlGastosService.data.push(this.controlGastosService.gastos[i].gastos.length)
        console.log('gastos',this.controlGastosService.gastos[i])
          let g = this.controlGastosService.gastos.findIndex(gasto => gasto.id == resp[i].iD_TIPO_GASTO)
          if(g >=0){
            this.controlGastosService[g].total = 0;
            this.controlGastosService[g].gastos.push(resp[i])
            this.controlGastosService[g].total = this.controlGastosService.gastos[g].gastos.length;
          }else{
            let  index = this.tipoGastosService.tiposGastos.findIndex( e => e.id == resp[i].iD_TIPO_GASTO)
      

            this.controlGastosService.gastos.push({
              id:resp[i].iD_TIPO_GASTO,
              imagen:this.tipoGastosService.tiposGastos[index].imagen,
              tipo:this.tipoGastosService.tiposGastos[index].descripcion,
              total:resp[i].monto,
              descripcion:this.tipoGastosService.tiposGastos[index].descripcion,
              gastos:[resp[i]]
            })
          }
      if(i == resp.length -1){

 

      }
    }





  }, error =>{
    this.alertasService.loadingDissmiss();

  })
}
 async  gastosSinAnticipo(){

  this.controlGastosService.gastoSinAnticipo = true;
 this.controlGastosService.destruirDashboard();
 await  this.controlGastosService.sincronizarGastos();
this.controlGastosService.labels = [];
this.controlGastosService.data = [];
 for(let i =0; i <this.controlGastosService.gastos.length; i++){

  if(this.controlGastosService.gastos[i].gastos.length > 0){
    this.controlGastosService.labels.push(this.controlGastosService.gastos[i].descripcion)
    this.controlGastosService.data.push(this.controlGastosService.gastos[i].gastos.length)
    console.log('gastos',this.controlGastosService.gastos[i])
  }

  if(i == this.controlGastosService.gastos.length -1){
  
    this.controlGastosService.gastos.sort((a,b) => b.total - a.total)
this.listo = true;
this.controlGastosService.cargarGRaficos();

    

  }
}
 
 

     

}

async  gastosConAnticipo(){

  this.controlGastosService.gastoSinAnticipo = false;
 this.controlGastosService.destruirDashboard();
 await  this.controlGastosService.sincronizarGastos();
this.controlGastosService.labels = [];
this.controlGastosService.data = [];
 for(let i =0; i <this.controlGastosService.gastos.length; i++){

  if(this.controlGastosService.gastos[i].gastos.length > 0){
    this.controlGastosService.labels.push(this.controlGastosService.gastos[i].descripcion)
    this.controlGastosService.data.push(this.controlGastosService.gastos[i].gastos.length)
    console.log('gastos',this.controlGastosService.gastos[i])
  }

  if(i == this.controlGastosService.gastos.length -1){
  
    this.controlGastosService.gastos.sort((a,b) => b.total - a.total)
this.listo = true;
this.controlGastosService.cargarGRaficos();

    

  }
}
 
 

     

}


     async nuevoGasto(){
      this.tiposGastosService.tipo = null;
     if(this.anticiposService.vistaAnticipo){
       await this.nuevoGastoAnticipo()
     }
   else{
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
     
      this.controlGastosService.gastoSinAnticipo = false;
      await  this.controlGastosService.syncTiposGastos();
      this.controlGastosService.sincronizarGastos();
        this.cargarGastos()
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


     async estadosDeCuenta(){
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
