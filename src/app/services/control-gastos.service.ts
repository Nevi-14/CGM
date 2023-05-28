import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { GastoConAnticipo } from '../models/gastoConAnticipo';
import { GastoSinAnticipo } from '../models/gastoSinAnticipo';
import { Anticipos } from '../models/anticipos';
import { anticiposLineasView } from '../models/anticiposLineasView';
import { GastosConAnticipoService } from './gastos-con-anticipo.service';
import { GastosSinAnticipoService } from './gastos-sin-anticipo.service';
import { SobrantesService } from './sobrantes.service';
import { AnticiposService } from './anticipos.service';
import { TiposGastosService } from './tipos-gastos.service';
import { EmailService } from './email.service';
import { UsuariosService } from './usuarios.service';
import { LineasAnticiposService } from './lineas-anticipos.service';
import { PdfService } from './pdf.service';
import { AlertasService } from './alertas.service';
import { TiposGastos } from '../models/tiposGastos';
import { Chart } from 'chart.js';
interface gastos {
  id: number,
  imagen: string,
  tipo: string,
  descripcion: string,
  total: number,
  gastos: any[] 
}
@Injectable({
  providedIn: 'root'
})
export class ControlGastosService {
  barChart: any;
  doughnutChart: any;
  lineChart: any;
 accionGasto:boolean = false;
  gastos: gastos[] = [];
  tiposGastos: TiposGastos[] = [];
anticipoLiquidado:boolean = false;
  fecha: Date = new Date();
  ano = this.fecha.getFullYear();
  mes = this.fecha.getMonth();
  fechaInicioS = this.getMonday(this.fecha);
  fechaFinS = this.obtenerFechaCorte();
  fechaInicioSemana = this.getMonday(this.fecha).toISOString();
  fechaFinSemana = this.obtenerFechaCorte().toISOString();
  fechaInicioMes = new Date(this.ano, this.mes, 1).toISOString();
  fechaFinMes = new Date(this.ano, this.mes + 1, 0).toISOString();
  gastoSinAnticipo: boolean = false;
  total: number = 0;
  labels = [];
  data = [];
  constructor(
public alertasService:AlertasService,
public usuariosService:UsuariosService,
public tiposGastosService:TiposGastosService,
public anticiposService:AnticiposService,
public lineasAnticiposService:LineasAnticiposService,
public gastosConAnticipoService:GastosConAnticipoService,
public gastosSinAnticipoService:GastosSinAnticipoService,
public sobrantesService:SobrantesService,
public emailService:EmailService,
public pdfService:PdfService

  ) { }



 async  destruirDashboard(){
 
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
   }

 async   cargarGRaficos(){
  await this.destruirDashboard();
    this.barChartMethod();
    this.doughnutChartMethod();
    this.lineChartMethod();
     
  }

   barChartMethod() {
    let barCanvas: any = document.getElementById('barCanvas');
    console.log('barCanvas',barCanvas)
    this.barChart = new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: '# de gastos',
          data: this.data,
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
    let doughnutCanvas: any = document.getElementById('doughnutCanvas');
    console.log('doughnutCanvas',doughnutCanvas)
    this.doughnutChart = new Chart(doughnutCanvas, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          label: '# de gastos',
          data: this.data,
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
    let lineCanvas: any = document.getElementById('lineCanvas');
    console.log('lineCanvas',lineCanvas)
    this.lineChart = new Chart(lineCanvas, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Gastos Mensuales',
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
            data: this.data,
            spanGaps: false,
          }
        ]
      }
    });
  }

   // end dashboard
  limpiarDatos() {
    this.labels = [];
    this.data = [];
    this.labels = ['No hay gastos que mostrar!.'];
    this.data = [0];
    this.anticiposService.anticipos = [];
    this.anticiposService.vistaAnticipos = [];
    this.gastos = [];

    this.anticiposService.vistaAnticipo = null;
    this.anticiposService.anticipo = null;

    this.fecha = new Date();
    this.ano = this.fecha.getFullYear();
    this.mes = this.fecha.getMonth();
    this.fechaInicioMes = new Date(this.ano, this.mes, 1).toISOString();
    this.fechaFinMes = new Date(this.ano, this.mes + 1, 0).toISOString();
    this.total = 0;

  }
  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  
  obtenerFechaCorte() {
    let currentDate = this.fechaInicioS;
    let date = currentDate.getDay();
    let daysToSunday = 7 - date;
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + daysToSunday);
  }
 async syncTiposGastos() {

    this.tiposGastosService.getTiposGastos().subscribe(
      resp => {
        console.log('Cargados los Tipos de Gastos')
        this.tiposGastosService.tiposGastos = resp.slice(0);
 
        this.tiposGastos = resp.slice(0);

        this.tiposGastosService.tiposGastos.forEach((tipo, indexT) => {
          let  index = this.tiposGastosService.tiposGastos.findIndex( e => e.id == tipo.id)
          let gasto = {
            id:tipo.id,
            imagen:tipo.imagen,
            tipo: tipo.tipo,
            descripcion: this.tiposGastosService.tiposGastos[index].descripcion,
            total: 0,
            gastos: []
          }
          let i = this.gastos.findIndex(v => v.id == tipo.id);
          if (i < 0) {
            this.gastos.push(gasto)
          }

          if(indexT == this.tiposGastosService.tiposGastos.length -1){
       // sincronizar gastos

          }
        })

      }
    ), error => {
      this.usuariosService.presentAlert('Error Sincronizando', 'No se ha podido leer los tipos de gastos.!!!');
    }
  }
 async sincronizarGastos(){
this.total = 0;
  this.alertasService.presentaLoading('Cargando gastos..')
let gastosUsuario = [];
    if(this.anticiposService.vistaAnticipo){
      gastosUsuario =  await this.lineasAnticiposService.syncGetAnticipoLineaGastosToPromise(this.anticiposService.vistaAnticipo.iD_LINEA);
    }else{
      gastosUsuario = await this.gastosSinAnticipoService.syncGetGastosSinAnticipoToPromise(this.usuariosService.usuario.usuario, '', this.fechaInicioMes, this.fechaFinMes)
    }
 
    if(gastosUsuario.length == 0){
      this.alertasService.loadingDissmiss();
    }
    console.log('gastosgastos', gastosUsuario)
      this.gastos.forEach((viatico, index) =>{
        viatico.total = 0;
console.log(viatico, 'viaa')
        if(index == this.gastos.length -1){
         
     if(this.anticiposService.vistaAnticipo){
      gastosUsuario.forEach((gasto: GastoConAnticipo, index2) => {
  
        console.log(gasto, 'gasto')
        let g = this.gastos.findIndex(ga => ga.id == gasto.iD_TIPO_GASTO);
        if(g >=0){
          this.total += gasto.monto
          this.gastos[g].total += gasto.monto
          this.gastos[g].gastos.push(gasto)
        }

        if(index2 == gastosUsuario.length -1){
          this.alertasService.loadingDissmiss();
        }
      })
     }else{
      gastosUsuario.forEach((gasto:GastoSinAnticipo, index2) => {
  

        console.log(gasto, 'gasto')
        let g = this.gastos.findIndex(ga => ga.id == gasto.iD_TIPO_GASTO);
        if(g >=0){
          this.total += gasto.monto
          this.gastos[g].total += gasto.monto
          this.gastos[g].gastos.push(gasto)
        }

        if(index2 == gastosUsuario.length -1){
          this.alertasService.loadingDissmiss();
        }
      })
     }
        }
      })

      if(this.anticiposService.vistaAnticipo){
  
      if(this.anticiposService.vistaAnticipo.estatus == 'R'){
        this.usuariosService.presentAlert('SD1 Móvil', 'La liquidación ha sido rechazada, confirma los gastos pendientes para continuar!.');
      }
        
      }
  }







}
