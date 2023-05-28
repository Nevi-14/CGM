import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { ChartData, ChartType } from 'chart.js';
import { AlertasService } from 'src/app/services/alertas.service';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js';
import { ListaAnticiposPage } from '../lista-anticipos/lista-anticipos.page';
import { EstadosCuentaPage } from '../estados-cuenta/estados-cuenta.page';
import { NuevoGastoSinAnticipoPage } from '../nuevo-gasto-sin-anticipo/nuevo-gasto-sin-anticipo.page';
import { NuevoGastoAnticipoPage } from '../nuevo-gasto-anticipo/nuevo-gasto-anticipo.page';
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
  @ViewChild('barCanvas') private barCanvas: ElementRef;
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  barChart: any;
  doughnutChart: any;
  lineChart: any;
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
  async    ionViewWillEnter() {
    if(this.barChart instanceof Chart)
{
  this.barChart.destroy();
}
 

if(this.doughnutChart instanceof Chart)
{
  this.doughnutChart.destroy();
}
 

if(this.lineChart instanceof Chart)
{
  this.lineChart.destroy();
}
 
    this.barChart = null;
    this.doughnutChart= null;
    this.lineChart= null;
      this.anticiposService.vistaAnticipo = null;
      this.controlGastosService.limpiarDatos();
      await this.controlGastosService.syncTiposGastos();
      this.cargarGastos()
     /**
      *   this.controlGastosService.gastos = [];
     
       if (!this.anticiposService.anticipo) {
   
         return this.alertasService.message('SD1 Móvil', 'Selecciona un anticipo o registra un gasto sin anticipo para continuar ..')
       }
   
      */
   //  this.limpiarDatosAnticipo()
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
   await  this.controlGastosService.syncTiposGastos();
   this.controlGastosService.sincronizarGastos();
     this.cargarGastos()
    }
  }
 async cargarGastos(){

  this.barChartMethod();
  this.doughnutChartMethod();
  this.lineChartMethod();

     this.listo = false;
     //this.alertasService.presentaLoading('Cargando Datos...')
     if(this.anticiposService.vistaAnticipo){
       this.vacio = false;
     this.gastosConAnticipo();
     }else{
       this.vacio = true;
       this.alertasService.loadingDissmiss();
       let gastosSinAnticipo = await     this.gastosSinAnticipoService.sincronizarGastosSinAnticipos( this.usuariosService.usuario.usuario, this.controlGastosService.fechaInicioMes, this.controlGastosService.fechaFinMes)
 
       if(gastosSinAnticipo.length > 0 && this.controlGastosService.gastos.length == 0) {
     
      if(this.vacio){
       this.vacio = false;
       return this.alertaGastosSinAnticipo();
      }else{
       this.gastosSinAnticipo()
      }
 
       } 
       this.alertasService.message('SD1', 'Lo sentimos no se ha registrado ningun gasto, selecciona un anticipo o crear un gasto sin anticipo!..')
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
           this.controlGastosService.syncTiposGastos();
          },
        }
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  
  
}
gastosConAnticipo(){
 
  this.controlGastosService.sincronizarGastos();
  this.gastosConAnticipoService.getUsuarioGastosConAnticipoEstadoToPromise(this.anticiposService.vistaAnticipo.iD_LINEA, "").then(resp =>{
    console.log('gastos resp', resp)
    this.alertasService.loadingDissmiss();
  
    for(let i =0; i < resp.length ; i++){
 
      console.log( resp[i],' resp[i]')
 
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

console.log('gastos array', this.controlGastosService.gastos)

let labels = [];
let data = [];

/**
 * for(let y =0; y < this.gastos.length; y++){

labels.push(this.gastos[y].gasto)
data.push(this.gastos[y].gastos.length)
if(y == this.gastos.length -1){
  this.gastos.sort((a,b) => b.total - a.total)
this.listo = true;
  this.pieChartData =  {
    labels: labels,
    datasets: [ {
      data: data
    } ]
  }

}
}
 */


      }
    }





  }, error =>{
    this.alertasService.loadingDissmiss();

  })
}
 async  gastosSinAnticipo(){
 
 await  this.controlGastosService.sincronizarGastos();
 let labels = [];
 let data = [];
 for(let i =0; i <this.controlGastosService.gastos.length; i++){

  if(this.controlGastosService.gastos[i].gastos.length > 0){
    labels.push(this.controlGastosService.gastos[i].descripcion)
    data.push(this.controlGastosService.gastos[i].gastos.length)
    console.log('gastos',this.controlGastosService.gastos[i])
  }

  if(i == this.controlGastosService.gastos.length -1){
  
    this.controlGastosService.gastos.sort((a,b) => b.total - a.total)
this.listo = true;
 
    this.changeDetector.detectChanges();

  }
}
 


     
 return
  //this.controlGastosService.syncTiposGastos();
    this.gastosSinAnticipoService.sincronizarGastosSinAnticipos( this.usuariosService.usuario.usuario, this.controlGastosService.fechaInicioMes, this.controlGastosService.fechaFinMes).then(resp =>{
      console.log('gastos resp', resp)
      this.alertasService.loadingDissmiss();
    
   
      for(let i =0; i < resp.length ; i++){
        console.log( resp[i],' resp[i]')
        this.controlGastosService.total += resp[i].monto;
        let g = this.controlGastosService.gastos.findIndex(gasto => gasto.id == resp[i].iD_TIPO_GASTO)
            if(g >=0){
              this.controlGastosService.gastos[g].gastos.push(resp[i])
              this.controlGastosService.gastos[g].total +=1;
            }
        if(i == resp.length -1){
  
console.log('gastos array', this.gastos)

let labels = [];
let data = [];
/**
 * 
for(let y =0; y < this.gastos.length; y++){

  labels.push(this.gastos[y].gasto)
  data.push(this.gastos[y].gastos.length)
  if(y == this.gastos.length -1){
    this.gastos.sort((a,b) => b.total - a.total)
this.listo = true;
    this.pieChartData =  {
      labels: labels,
      datasets: [ {
        data: data
      } ]
    }
    this.changeDetector.detectChanges();

  }
}
 */


        }
      }





    }, error =>{
      this.alertasService.loadingDissmiss();

    })
   
  }



     barChartMethod() {
       this.barChart = new Chart(this.barCanvas.nativeElement, {
         type: 'bar',
         data: {
           labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
           datasets: [{
             label: '# of Votes',
             data: [200, 50, 30, 15, 20, 34],
             backgroundColor: [
               'rgba(255, 99, 132, 0.2)',
               'rgba(54, 162, 235, 0.2)',
               'rgba(255, 206, 86, 0.2)',
               'rgba(75, 192, 192, 0.2)',
               'rgba(153, 102, 255, 0.2)',
               'rgba(255, 159, 64, 0.2)'
             ],
             borderColor: [
               'rgba(255,99,132,1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
               'rgba(75, 192, 192, 1)',
               'rgba(153, 102, 255, 1)',
               'rgba(255, 159, 64, 1)'
             ],
             borderWidth: 1
           }]
         },
         options: {
   
         }
       });
     }
   
     doughnutChartMethod() {
       this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
         type: 'doughnut',
         data: {
           labels: ['BJP', 'Congress', 'AAP', 'CPM', 'SP'],
           datasets: [{
             label: '# of Votes',
             data: [50, 29, 15, 10, 7],
             backgroundColor: [
               'rgba(255, 159, 64, 0.2)',
               'rgba(255, 99, 132, 0.2)',
               'rgba(54, 162, 235, 0.2)',
               'rgba(255, 206, 86, 0.2)',
               'rgba(75, 192, 192, 0.2)'
             ],
             hoverBackgroundColor: [
               '#FFCE56',
               '#FF6384',
               '#36A2EB',
               '#FFCE56',
               '#FF6384'
             ]
           }]
         }
       });
     }
   
     lineChartMethod() {
       this.lineChart = new Chart(this.lineCanvas.nativeElement, {
         type: 'line',
         data: {
           labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],
           datasets: [
             {
               label: 'Sell per week',
               fill: false,
               backgroundColor: 'rgba(75,192,192,0.4)',
               borderColor: 'rgba(75,192,192,1)',
               borderCapStyle: 'butt',
               borderDash: [],
               borderDashOffset: 0.0,
               borderJoinStyle: 'miter',
               pointBorderColor: 'rgba(75,192,192,1)',
               pointBackgroundColor: '#fff',
               pointBorderWidth: 1,
               pointHoverRadius: 5,
               pointHoverBackgroundColor: 'rgba(75,192,192,1)',
               pointHoverBorderColor: 'rgba(220,220,220,1)',
               pointHoverBorderWidth: 2,
               pointRadius: 1,
               pointHitRadius: 10,
               data: [65, 59, 80, 81, 56, 55, 40, 10, 5, 50, 10, 15],
               spanGaps: false,
             }
           ]
         }
       });
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
      this.gastos = [];
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
