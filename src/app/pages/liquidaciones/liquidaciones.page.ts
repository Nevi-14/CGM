import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { LineaAnticipo } from 'src/app/models/lineaAnticipo';
import { Sobrantes } from 'src/app/models/sobrantes';
import { AlertasService } from 'src/app/services/alertas.service';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { EmailService } from 'src/app/services/email.service';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { SobrantesService } from 'src/app/services/sobrantes.service';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormularioLiquidacionPage } from '../formulario-liquidacion/formulario-liquidacion.page';
import { EditarGastoSinAnticipoPage } from '../editar-gasto-sin-anticipo/editar-gasto-sin-anticipo.page';
import { EditarGastoPage } from '../editar-gasto/editar-gasto.page';
import { GastoConAnticipo } from 'src/app/models/gastoConAnticipo';
import { Correo } from 'src/app/models/correo';

@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.page.html',
  styleUrls: ['./liquidaciones.page.scss'],
})
export class LiquidacionesPage {
  today:Date = new Date();
  y = this.today.getFullYear();
  m = this.today.getMonth();
  value1 = new Date(this.y, this.m , 1).toISOString();
  value2 = new Date(this.y, this.m+1 , 0).toISOString();
  gastos:any[]=[]
  telefono:string = null;
  cuenta:string= null;
  totalColones = 0;
  totalDolares = 0;
  metodoDevolucionD=null;
  sobrante:Sobrantes = {
     id : null,
     estatus:'P',
     usuario:this.usuariosService.usuario.usuario,
     usuariO_APROBADOR:null,
     anticipo:this.anticiposService.vistaAnticipo ? true : false,
     referencia:this.anticiposService.vistaAnticipo ? this.anticiposService.vistaAnticipo.numerO_TRANSACCION : null,  
     metodO_DEVOLUCION:null,
     cuenta:null,
     telefono:null,
     justificacion:'Sobrante',
     descripcion:'descripcion',
     adjunto:null,
     monto:0,
     obvervaciones:null
  }
  url = "https://sde1.sderp.site/api-coris-control-gastos/api/descargar-archivo?id=";
   lineaAnticipo:LineaAnticipo
  constructor(

    public modalCtrl:ModalController,
    public usuariosService:UsuariosService,
    public anticiposService:AnticiposService,
    public alertasService: AlertasService,
    public emailService:EmailService,
    public gastosConAnticipoService:GastosConAnticipoService,
    public alertCtrl:AlertController,
    public controlGastosService:ControlGastosService,
    public gastosSinAnticipoService:GastosSinAnticipoService,
    public sobrantesService:SobrantesService,
    public tiposGastosService:TiposGastosService
  ) { }

  async filtro() {
    const alert = await this.alertCtrl.create({
      header: 'Dione',
      subHeader:'Seleccione una opción',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: 'Continuar',
          role: 'confirm',
          handler: (data) => {
            console.log('data', data)
 

          },
        },
      ],
      mode:'ios',
      inputs: [
        {
          label: 'Gastos Pendientes',
          type: 'radio',
          value: 'P',
        },
        {
          label: 'Gastos Aprobados',
          type: 'radio',
          value: 'A',
        },
        {
          label: 'Gastos Rechazados',
          type: 'radio',
          value: 'R',
        }
      ],
    });

    await alert.present();
  }
  async    ionViewWillEnter() {
    this.totalColones = 0;
    this.totalDolares = 0;
    this.gastos = [];
if(this.controlGastosService.gastoSinAnticipo || !this.controlGastosService.gastoSinAnticipo && this.anticiposService.vistaAnticipo){
  this.sincronizar()
}else{
  this.alertasService.message('SD1 Móvil','Lo sentimos no hay gastos que mostrar!..')
}
   }
   regresar(){
    this.modalCtrl.dismiss();
   }
   async limpiarDatos(){
    await this.controlGastosService.limpiarDatosIniciales();
    this.totalColones = 0;
    this.totalDolares = 0;
    this.gastos = [];
   }
   async editarGasto(nuevoGasto:GastoConAnticipo){

    if(nuevoGasto.estatus == 'A'){
      return this.alertasService.message('SD1 Móvil','Lo sentimos, no se pueden modificar gastos aprobados!..')
    }
    const modal = await this.modalCtrl.create({
      component: this.anticiposService.vistaAnticipo ? EditarGastoPage : EditarGastoSinAnticipoPage,
      mode:'ios',
      componentProps:{
        nuevoGasto
      }
    })
    modal.present();
    const { data } = await modal.onDidDismiss();

    if (data != undefined) {
      if(this.controlGastosService.accionGasto && this.anticiposService.vistaAnticipo){

        let  lineaAnticipos =  await this.anticiposService.syncGetLineaUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.iD_LINEA);
        this.lineaAnticipo = lineaAnticipos[0];
        console.log('lineaAnticipo',this.lineaAnticipo)
          this.gastosConAnticipoService.getUsuarioGastosConAnticipoEstadoToPromise(this.anticiposService.vistaAnticipo.iD_LINEA,"").then(gastos =>{
           this.gastos = gastos;
           this.sincronizar()
           if(gastos.length == 0){
             this.modalCtrl.dismiss(true)
           }
         
 
          })



     
       }
    if(this.controlGastosService.accionGasto && !this.anticiposService.vistaAnticipo){
   let gastos = await this.gastosSinAnticipoService.syncGetGastosSinAnticipoToPromise(this.usuariosService.usuario.usuario,'P', this.controlGastosService.fechaInicioMes, this.controlGastosService.fechaFinMes)
   this.gastos = gastos;
   if(gastos.length == 0){
     this.controlGastosService.accionGasto = false;
     this.modalCtrl.dismiss()
     this.controlGastosService.gastoSinAnticipo = true;
   }
   this.sincronizar()
 
 }
 


 
    }


   }


  async sincronizar(){
    this.totalColones = 0;
    this.totalDolares = 0;
    this.alertasService.presentaLoading('Cargando gastos...')
await this.controlGastosService.syncTiposGastos();

    if(this.anticiposService.vistaAnticipo){
      let  lineaAnticipos =  await this.anticiposService.syncGetLineaUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.iD_LINEA);
      this.lineaAnticipo = lineaAnticipos[0];
      console.log('lineaAnticipo',this.lineaAnticipo)
        this.gastosConAnticipoService.getUsuarioGastosConAnticipoEstadoToPromise(this.anticiposService.vistaAnticipo.iD_LINEA,"").then(gastos =>{
         this.gastos = gastos;
         if(gastos.length == 0){
          this.alertasService.loadingDissmiss();
          this.alertasService.message('SD1 Móvil','Lo sentimos no se encontraron gastos registrados!.')
         }
         gastos.forEach(async (gasto, index) =>{
           this.totalColones += gasto.monto;
           if(index  == gastos.length -1){
            this.alertasService.loadingDissmiss();
           if(this.anticiposService.vistaAnticipo.estatus == 'R'){
            let sobrante = await this.sobrantesService.syncGetSobranteAnticipoUsuarioToPromise(this.usuariosService.usuario.usuario, String(this.anticiposService.vistaAnticipo.numerO_TRANSACCION));
            if(sobrante){
              this.sobrante = sobrante[0]; 
            }
           }
           }
         })
        })
    }else{
  
   
        this.gastosSinAnticipoService.sincronizarGastosSinAnticipos( this.usuariosService.usuario.usuario, this.controlGastosService.fechaInicioMes, this.controlGastosService.fechaFinMes,).then(gastos =>{
         this.gastos = gastos;
         if(gastos.length == 0){
          this.alertasService.loadingDissmiss();
          this.alertasService.message('SD1 Móvil','Lo sentimos no se encontraron gastos registrados!.')
         }
         gastos.forEach((gasto, index) =>{
         if(gasto.moneda == '¢'){
          this.totalColones += gasto.monto;
         }else{
          this.totalDolares+= gasto.monto;
         }
           if(index == gastos.length -1){
            this.alertasService.loadingDissmiss();
           }
         })
        })
  
    }
  
  }

  imagenT(gastos:any){
    let i = this.tiposGastosService.tiposGastos.findIndex(e => e.id == gastos.iD_TIPO_GASTO);
    if(i >=0){
      return this.tiposGastosService.tiposGastos[i].imagen
    }
  }

  async formularioLiquidacion() {
  
 if(!this.anticiposService.vistaAnticipo) return this.liquidarGastosSinAnticipo();
 if(this.anticiposService.vistaAnticipo.restante == 0 ) return this.liquidacionAnticipoSinRestate();
    const modal = await this.modalCtrl.create({
      component: FormularioLiquidacionPage,
      componentProps: {
        anticipo: this.anticiposService.vistaAnticipo,
        lineaAnticipo: this.lineaAnticipo
      },
      mode: 'ios',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      this.limpiarDatos();
    }
  } 


  async liquidacionAnticipoSinRestate(){  
      this.controlGastosService.anticipoLiquidado = true;
      let email:Correo = {
        toEmail:'nelson@sde.cr',
        file:null,
        subject:'Liquidación Anticipo #'+ this.anticiposService.vistaAnticipo.id,
        body:'Proceder a liquidar el siguiente anticipo' +' #' + this.anticiposService.vistaAnticipo.id +' / Transacción - ' + this.anticiposService.vistaAnticipo.numerO_TRANSACCION  +'<br>' +
        'cumana@grupocoris.com' + '<br>'  +
        'rarayab@grupocoris.com' + '<br>'  +
        'mherra@sde.cr'
      }
    
      this.lineaAnticipo.restante =    this.anticiposService.vistaAnticipo.restante;
      this.lineaAnticipo.utilizado =  this.anticiposService.vistaAnticipo.utilizado ; 
    
      this.alertasService.presentaLoading('Liquidando gastos..')
      this.lineaAnticipo.estatus = 'RA'  
      let anticipo:any =   await this.anticiposService.syncPutLineaAnticipoToPromise(this.lineaAnticipo);
        this.anticiposService.anticipo = anticipo;
 
 
    let gastos = await  this.gastosConAnticipoService.getUsuarioGastosConAnticipoEstadoToPromise(this.anticiposService.vistaAnticipo.iD_LINEA, 'P')
    gastos.forEach(async (element, index) => { 
      element.estatus = 'RA'
     await this.gastosConAnticipoService.syncPutGastoConAnticipoToPromise(element)
     
     if(index == gastos.length -1){
      this.emailService.syncPostEmailToPromise(email).then(async (resp) =>{
        this.limpiarDatos();
        this.modalCtrl.dismiss(true)
        this.alertasService.loadingDissmiss();
        this.alertasService.message('SD1 Móvil', 'Liquidación enviada!..')
      }, error =>{
        this.alertasService.loadingDissmiss();
        this.alertasService.message('SD1 Móvil', 'Lo sentimos algo salio mal..')
      })
    
    
     }
      
     });
    
  }
 async liquidarGastosSinAnticipo(){
this.alertasService.presentaLoading('Liquidando gastos sin anticipo!...')
await this.gastosSinAnticipoService.syncGetGastosSinAnticipoToPromise(this.usuariosService.usuario.usuario,'P', this.controlGastosService.fechaInicioMes, this.controlGastosService.fechaFinMes).then(gastos =>{
  if(gastos.length == 0) return    this.alertasService.message('SD1 Móvil', 'No hay gastos pendientes que liquidar!'),this.alertasService.loadingDissmiss(), this.modalCtrl.dismiss(true)
  gastos.forEach(async (element, index) => {
  element.estatus = 'RA'
   await this.gastosSinAnticipoService.syncPutGastoSinAnticipoToPromise(element)
   if(index == gastos.length -1){
    this.limpiarDatos();
    this.modalCtrl.dismiss(true)
    this.alertasService.loadingDissmiss();
    this.alertasService.message('SD1 Móvil', 'Liquidación enviada!..')
   }
    
   }, error =>{
    this.alertasService.message('SD1 Móvil', 'Lo sentimos algo salio mal')
    this.alertasService.loadingDissmiss();
   });

})
 
  
 
  }
}
