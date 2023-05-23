import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartData, ChartEvent, ChartType, ChartConfiguration } from 'chart.js';
import {BaseChartDirective, ThemeService } from 'ng2-charts'; // https://www.npmjs.com/package/ng2-charts + https://valor-software.com/ng2-charts/#PieChart  + https://www.npmjs.com/package/chartjs-plugin-datalabels
import { AlertasService } from '../../services/alertas.service';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { GastoConAnticipo } from 'src/app/models/gastoConAnticipo';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
// To use this package install the below dependencies
// npm i chart.js
// npm i ng2-charts
// npm i chartjs-plugin-datalabels
interface gastos {
  gasto:string,
  id:number
  total:number,
  gastos:any[]
}

@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.page.html',
  styleUrls: ['./mis-gastos.page.scss'],
})
export class MisGastosPage implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  width:number;
  chartHeight  = '100%';
gastos:gastos[]=[];
today:Date = new Date();
y = this.today.getFullYear();
m = this.today.getMonth();
value1 = new Date(this.y, this.m , 1).toISOString();
value2 = new Date(this.y, this.m+1 , 0).toISOString();
total:number = 0;
public pieChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    datalabels: {
      formatter: (value, ctx) => {
        if (ctx.chart.data.labels) {
          return ctx.chart.data.labels[ctx.dataIndex];
        }
      },
    },
  }
};
 pieChartData: ChartData<'pie', number[], string | string[]> = null;
public pieChartType: ChartType = 'pie';
public pieChartPlugins = [ DatalabelsPlugin ];
  constructor(public modalCtrl:ModalController,
     public alertasSerivice: AlertasService,
     public usuariosService:UsuariosService,
     public anticiposService:AnticiposService,
     public gastosConAnticipoService:GastosConAnticipoService,
     public tipoGastosService:TiposGastosService,
     public controlGastosService:ControlGastosService,
     public gastosSinAnticipoService:GastosSinAnticipoService
     
     
     ) { }
  async ngOnInit() {
 
    
    this.alertasSerivice.presentaLoading('Cargando Datos...')

    if(this.anticiposService.vistaAnticipo){
      this.gastosConAnticipoService.getUsuarioGastosConAnticipoEstadoToPromise(this.anticiposService.vistaAnticipo.iD_LINEA, "").then(resp =>{
        console.log('gastos resp', resp)
        this.alertasSerivice.loadingDissmiss();
        console.log(this.gastos)
        for(let i =0; i < resp.length ; i++){
          console.log( resp[i],' resp[i]')
          this.total += resp[i].monto;
          let g = this.gastos.findIndex(gasto => gasto.id == resp[i].iD_TIPO_GASTO)
              if(g >=0){
                this.gastos[g].gastos.push(resp[i])
                this.gastos[g].total = this.gastos[g].gastos.length;
              }else{
                let  index = this.tipoGastosService.tiposGastos.findIndex( e => e.id == resp[i].iD_TIPO_GASTO)
                this.gastos.push({
                  gasto:this.tipoGastosService.tiposGastos[index].descripcion,
                  id:resp[i].iD_TIPO_GASTO,
                  total:1,
                  gastos:[resp[i]]
                })
              }
          if(i == resp.length -1){
    
  console.log('gastos array', this.gastos)
  
  let labels = [];
  let data = [];
  
  for(let y =0; y < this.gastos.length; y++){
  
    labels.push(this.gastos[y].gasto)
    data.push(this.gastos[y].gastos.length)
    if(y == this.gastos.length -1){
      this.gastos.sort((a,b) => b.total - a.total)
  
      this.pieChartData =  {
        labels: labels,
        datasets: [ {
          data: data
        } ]
      }
  
    }
  }
  
  
          }
        }
  
  
  
  
  
      }, error =>{
        this.alertasSerivice.loadingDissmiss();
  
      })
    }else{
  
      this.gastosSinAnticipoService.sincronizarGastosSinAnticipos( this.usuariosService.usuario.usuario, this.controlGastosService.fechaInicioMes, this.controlGastosService.fechaFinMes).then(resp =>{
        console.log('gastos resp', resp)
        this.alertasSerivice.loadingDissmiss();
        console.log(this.gastos)
        for(let i =0; i < resp.length ; i++){
          console.log( resp[i],' resp[i]')
          this.total += resp[i].monto;
          let g = this.gastos.findIndex(gasto => gasto.id == resp[i].iD_TIPO_GASTO)
              if(g >=0){
                this.gastos[g].gastos.push(resp[i])
                this.gastos[g].total = this.gastos[g].gastos.length;
              }else{
                let  index = this.tipoGastosService.tiposGastos.findIndex( e => e.id == resp[i].iD_TIPO_GASTO)
                this.gastos.push({
                  gasto:this.tipoGastosService.tiposGastos[index].descripcion,
                  id:resp[i].iD_TIPO_GASTO,
                  total:1,
                  gastos:[resp[i]]
                })
              }
          if(i == resp.length -1){
    
  console.log('gastos array', this.gastos)
  
  let labels = [];
  let data = [];
  
  for(let y =0; y < this.gastos.length; y++){
  
    labels.push(this.gastos[y].gasto)
    data.push(this.gastos[y].gastos.length)
    if(y == this.gastos.length -1){
      this.gastos.sort((a,b) => b.total - a.total)
  
      this.pieChartData =  {
        labels: labels,
        datasets: [ {
          data: data
        } ]
      }
  
    }
  }
  
  
          }
        }
  
  
  
  
  
      }, error =>{
        this.alertasSerivice.loadingDissmiss();
  
      })
     
  
    }







    
   
  }
 

  regresar(){
    this.modalCtrl.dismiss();
  }
}
