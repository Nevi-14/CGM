import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { EmailService } from 'src/app/services/email.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EditarGastoPage } from '../editar-gasto/editar-gasto.page';
import { GastoConAnticipo } from 'src/app/models/gastoConAnticipo';
import { Correo } from 'src/app/models/correo';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { LineaAnticipo } from 'src/app/models/lineaAnticipo';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { EditarGastoSinAnticipoPage } from '../editar-gasto-sin-anticipo/editar-gasto-sin-anticipo.page';
import { GastoSinAnticipo } from 'src/app/models/gastoSinAnticipo';
import { Sobrantes } from 'src/app/models/sobrantes';
import { SobrantesService } from 'src/app/services/sobrantes.service';
@Component({
  selector: 'app-gestion-gastos',
  templateUrl: './gestion-gastos.page.html',
  styleUrls: ['./gestion-gastos.page.scss'],
})
export class GestionGastosPage implements OnInit {
@Input() titulo:string
@Input() estado:string | null | undefined
today:Date = new Date();
y = this.today.getFullYear();
m = this.today.getMonth();
value1 = new Date(this.y, this.m , 1).toISOString();
value2 = new Date(this.y, this.m+1 , 0).toISOString();
gastos:any[]=[]
telefono:string = null;
cuenta:string= null;
total = 0;
focuse = [
  {focus1:false},
  {focus2:false},
  {focus3:false},
  {focus4:false},
]
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
    public sobrantesService:SobrantesService
  ) { }

 async ngOnInit() {
this.sincronizar()
  }
async sincronizar(){

  if(this.anticiposService.vistaAnticipo){
    let  lineaAnticipos =  await this.anticiposService.syncGetLineaUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.iD_LINEA);
    this.lineaAnticipo = lineaAnticipos[0];
    console.log('lineaAnticipo',this.lineaAnticipo)
      this.gastosConAnticipoService.getUsuarioGastosConAnticipoEstadoToPromise(this.anticiposService.vistaAnticipo.iD_LINEA,this.estado ? this.estado : "").then(gastos =>{
       this.gastos = gastos;
       gastos.forEach(async (gasto, index) =>{
         this.total += gasto.monto;
         if(index  == gastos.length -1){
         if(this.anticiposService.vistaAnticipo.estatus == 'R'){
          let sobrante = await this.sobrantesService.syncGetSobranteAnticipoUsuarioToPromise(this.usuariosService.usuario.usuario, this.anticiposService.vistaAnticipo.numerO_TRANSACCION);
          if(sobrante){
            this.sobrante = sobrante[0]; 
            this.focuse[0].focus1 = true;
            this.focuse[1].focus2 = true;
            this.focuse[2].focus3 = true;
          }
         }
         }
       })
      })
  }else{

 
      this.gastosSinAnticipoService.sincronizarGastosSinAnticipos( this.usuariosService.usuario.usuario, this.controlGastosService.fechaInicioMes, this.controlGastosService.fechaFinMes,).then(gastos =>{
       this.gastos = gastos;
       gastos.forEach(gasto =>{
         this.total += gasto.monto;
       })
      })

  }

}
  regresar(){
    this.modalCtrl.dismiss();
  
  }

  cambiarMetodoDevolucion(){
    if(this.sobrante.metodO_DEVOLUCION == 'sinpe'){
      this.sobrante.cuenta = null;
    }else{
      this.sobrante.telefono = null;
    }
  }
  async metodoDevolucion() {

 
    this.liquidarGastos();
  }

 async  liquidarGastos(data?){

 
 if(this.anticiposService.vistaAnticipo){
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
  this.lineaAnticipo.estatus = 'I'

  let anticipo:any =   await this.anticiposService.syncPutLineaAnticipoToPromise(this.lineaAnticipo);
    this.anticiposService.anticipo = anticipo;
this.sobrante.monto = this.anticiposService.vistaAnticipo.restante;
if(this.anticiposService.vistaAnticipo.estatus == 'P') await this.sobrantesService.syncPostSobranteToPromise(this.sobrante)
if(this.anticiposService.vistaAnticipo.estatus == 'R') await this.sobrantesService.syncPutSobranteToPromise(this.sobrante)
let gastos = await  this.gastosConAnticipoService.getUsuarioGastosConAnticipoEstadoToPromise(this.anticiposService.vistaAnticipo.iD_LINEA, 'P')
gastos.forEach(async (element, index) => {

  element.estatus = 'I'
 await this.gastosConAnticipoService.syncPutGastoConAnticipoToPromise(element)
 
 if(index == gastos.length -1){
  this.emailService.syncPostEmailToPromise(email).then(async (resp) =>{
    this.controlGastosService.limpiarDatos();
    await this.controlGastosService.syncTiposGastos();
    this.controlGastosService.gastoSinAnticipo = false;
    await this.controlGastosService.sincronizarGastos();
    this.modalCtrl.dismiss(true)
    this.alertasService.loadingDissmiss();
    this.alertasService.message('SD1 Móvil', 'Liquidación enviada!..')
 

  }, error =>{
    this.alertasService.loadingDissmiss();
    this.alertasService.message('SD1 Móvil', 'Lo sentimos algo salio mal..')
  })


 }
  
 });


 }else{

  let identificador = this.controlGastosService.fechaInicioSemana.split('T')[0]+this.controlGastosService.fechaFinSemana.split('T')[0];

   let gastos = await this.gastosSinAnticipoService.syncGetGastosSinAnticipoToPromise(this.usuariosService.usuario.usuario,'P', this.controlGastosService.fechaInicioMes, this.controlGastosService.fechaFinMes)

   gastos.forEach(async (element, index) => {

    element.estatus = 'I'
   await this.gastosSinAnticipoService.syncPutGastoSinAnticipoToPromise(element)
   
   if(index == gastos.length -1){
    this.controlGastosService.limpiarDatos();
    await this.controlGastosService.syncTiposGastos();
    this.controlGastosService.gastoSinAnticipo = false;
    await this.controlGastosService.sincronizarGastos();
    this.modalCtrl.dismiss(true)
    this.alertasService.loadingDissmiss();
    this.alertasService.message('SD1 Móvil', 'Liquidación enviada!..')
   }
    
   });

 
 }
 
  }

  async consultar() {
    let vistasAnticipos = await this.anticiposService.syncGetUsuarioAnticiposRngoFecha(this.usuariosService.usuario.usuario,new Date().toISOString());
    let i = vistasAnticipos.findIndex( e => e.id == this.anticiposService.vistaAnticipo.id);
 
    if(i >=0){
     this.anticiposService.vistaAnticipo = null;
     this.anticiposService.getgastosAnticipoRangoFechaToPromise(this.anticiposService.vistaAnticipo.iD_LINEA).then(gastos =>{
       console.log('gastosgastos', gastos)
       this.gastosConAnticipoService.gastos.forEach((viatico, index) =>{
         viatico.total = 0;
 console.log(viatico, 'viaa')
         if(index == this.gastosConAnticipoService.gastos.length -1){
       
           gastos.forEach(gasto => {
   
 
             let g = this.gastosConAnticipoService.gastos.findIndex(ga => ga.id == gasto.iD_TIPO_GASTO);
             if(g >=0){
               this.gastosConAnticipoService.gastos[g].total += gasto.monto
               this.gastosConAnticipoService.gastos[g].gastos.push(gasto)
             }
           })
         }
       })
 
       if(this.anticiposService.vistaAnticipo.estatus == 'R'){
         this.usuariosService.presentAlert('SD1 Móvil', 'Anticipo en proceso de liquidación');
       }
     })
    }
 
  
 
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


   }
   async actualizarMonto(gasto:GastoConAnticipo) {
    const alert = await this.alertCtrl.create({
      header: 'Ingresa un nuevo monto',
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
          handler: async (data:any) => {
            console.log(data)
            console.log(gasto)
            let restante =   gasto.monto - data[0];
            gasto.monto = data[0];
            this.anticiposService.vistaAnticipo.monto  - restante;
         this.anticiposService.vistaAnticipo.restante += restante;
           this.anticiposService.vistaAnticipo.utilizado -=restante
            this.total -= restante;
           await  this.gastosConAnticipoService.syncPutGastoConAnticipoToPromise(gasto)
            
          },
        },
      ],
      inputs: [
        {
          placeholder: 'Monto',
        },
   
      ],
    });

    await alert.present();
  }



async delete(nuevoGasto:any){
  this.alertasService.presentaLoading('Guardando cambios...')
  if(this.controlGastosService.gastoSinAnticipo){
    this.deleteGastoSinAnticipo(nuevoGasto)

  }else{
    this.deleteGastoConAnticipo(nuevoGasto);
  }
    
  
}

async deleteGastoConAnticipo(nuevoGasto:GastoConAnticipo){
  let anticipos = await this.anticiposService.syncGetUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.id);
    let anticipo = anticipos[0];
    anticipo.utilizado -= nuevoGasto.monto;
    anticipo.restante = anticipo.monto - anticipo.utilizado;
    this.anticiposService.vistaAnticipo.utilizado -= nuevoGasto.monto;
    this.anticiposService.vistaAnticipo.restante = anticipo.monto - anticipo.utilizado;
    
  
    
    let lineas = await this.anticiposService.syncGetLineaUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.iD_LINEA);
    await this.anticiposService.syncPutAnticipoToPromise(anticipo);
    let linea = lineas[0];
    console.log('lineas', lineas)
    console.log('linea', linea)
    linea.utilizado -= nuevoGasto.monto;
    linea.restante = linea.monto - linea.utilizado;
    await this.anticiposService.syncPutLineaAnticipoToPromise(linea);
  this.gastosConAnticipoService.syncDeleteGastoConAnticipoToPromise(nuevoGasto.id);
  //await this.anticiposService.sincronizarDatos();
  //await this.sincronizar()
  this.controlGastosService.sincronizarGastos();
  this.alertasService.loadingDissmiss();
   
}
async deleteGastoSinAnticipo(nuevoGasto:GastoSinAnticipo){
 await this.gastosSinAnticipoService.syncDeleteGastoSinAnticipoToPromise(nuevoGasto.id);
  //await this.anticiposService.sincronizarDatos();
  //await this.sincronizar()
  this.controlGastosService.sincronizarGastos();

  this.modalCtrl.dismiss(true)
  this.alertasService.loadingDissmiss();
}
}
