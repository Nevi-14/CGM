import { Component, OnInit } from '@angular/core';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { ModalController, PopoverController } from '@ionic/angular';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NgForm } from '@angular/forms';
import { ListaAnticiposPage } from '../lista-anticipos/lista-anticipos.page';
import { Anticipos } from 'src/app/models/anticipos';
import { VistaAnticipoLineasAnticipo } from 'src/app/models/vistaAnticipoLineasAnticipo';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { AnticiposService } from 'src/app/services/anticipos.service';

@Component({
  selector: 'app-filtro-historial',
  templateUrl: './filtro-historial.page.html',
  styleUrls: ['./filtro-historial.page.scss'],
})
export class FiltroHistorialPage implements OnInit {
  tiposGastos = [
    {
      id:'CA',
      valor:'Con Anticipo'
    },
    {
      id:'SA',
      valor:'Sin Anticipo'
    },
    {
      id:'EC',
      valor:'Estado Cuenta'
    }
  ]
 estado = 'null'
estados = [
  {
    id:'P',
    valor:'Pendientes'
  },
  {
    id:'I',
    valor:'En Proceso'
  },
  {
    id:'R',
    valor:'Rechazados'
  },
  {
    id:'A',
    valor:'Aprobados'
  },
  {
    id:'null',
    valor:'Todos'
  }
]
referencia = '';
gastosConAnticipo:string = 'SA';
anticipo:Anticipos = null;
vistaAnticipo:VistaAnticipoLineasAnticipo = null;
readonly:boolean = true;
  constructor(
  public popOverCtrl:PopoverController,
  public lineasAnticiposService:LineasAnticiposService,
  public gastosSinAnticipoService:GastosSinAnticipoService ,
  public usuariosService:UsuariosService,
  public modalCtrl:ModalController ,
  public gastosConAnticipoService:GastosConAnticipoService,
  public anticiposService:AnticiposService
  ) { }
  fechaInicial = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  fechaFinal = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  ngOnInit() {
  }
  async calendarioPopOver(fecha:string) {
    const popover = await this.popOverCtrl.create({
      component: CalendarioPopoverPage,
      cssClass: 'my-custom-class',
      mode:'md',
      translucent: true,
      componentProps: {
        fecha:  fecha == 'fechaInicial' ? this.fechaInicial  : this.fechaFinal
      }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data != undefined) {
 
      fecha == 'fechaInicial' ? this.fechaInicial = new Date(data.fecha) : this.fechaFinal= new Date(data.fecha);
   

    }
  }
  filtroEstado(fFiltro:NgForm, $event){ 
    console.log($event, 'event')
    this.estado = fFiltro.value.estado;
    
  }

 async  buscarGastoAnticipo($event){
    let gastos = await this.gastosConAnticipoService.syncGetUsuarioGastosConAnticiporeferenciaToPromise($event.detail.value)
    
     this.anticiposService.syncGetVistaAnticipoReferenciaToPromise($event.detail.value).then( resp =>{
      this.modalCtrl.dismiss({
        vistaAnticipo:resp[0],
        gastos:gastos
      })
    })
   
  }
  filtroGastoConAnticipo(fFiltro:NgForm, $event){ 
    console.log($event, 'event')

    
    this.estado = 'null';
    this.referencia = '';
    this.anticipo= null;
    this.vistaAnticipo = null
    this.fechaInicial = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.fechaFinal = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    this.gastosConAnticipo = fFiltro.value.tipoGasto;
/**
 *     if(fFiltro.value.tipoGasto == 'true') {
      this.gastosConAnticipo = true;

    }else{
      this.gastosConAnticipo = false
    }
    
 */
  }
 async  filtrarGastos(fFiltro:NgForm){
  if(  this.estado = 'null')   this.estado = '';
if(!this.anticipo){
  let gastos = await this.gastosSinAnticipoService.syncGetGastosSinAnticipoToPromise(this.usuariosService.usuario.usuario, this.estado, this.fechaInicial.toISOString().split('T')[0], this.fechaFinal.toISOString().split('T')[0])
  console.log('gastos sin anticipo', gastos)
  this.modalCtrl.dismiss({
    vistaAnticipo:null,
    gastos:gastos
  })
}else{
  let gastos = await this.gastosConAnticipoService.getUsuarioGastosConAnticipoEstadoToPromise(this.anticipo.id ,'')
  this.modalCtrl.dismiss({
    vistaAnticipo:this.vistaAnticipo,
    gastos:gastos
  })
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
console.log('data', data)
this.anticipo =  data.anticipo;
this.vistaAnticipo = data.vistaAnticipo;
    }
  }

}
