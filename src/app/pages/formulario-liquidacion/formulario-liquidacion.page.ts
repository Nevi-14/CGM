import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Correo } from 'src/app/models/correo';
import { LineaAnticipo } from 'src/app/models/lineaAnticipo';
import { Sobrantes } from 'src/app/models/sobrantes';
import { AlertasService } from 'src/app/services/alertas.service';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { EmailService } from 'src/app/services/email.service';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { SobrantesService } from 'src/app/services/sobrantes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-formulario-liquidacion',
  templateUrl: './formulario-liquidacion.page.html',
  styleUrls: ['./formulario-liquidacion.page.scss'],
})
export class FormularioLiquidacionPage implements OnInit {
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
 lineaAnticipo:LineaAnticipo
 metodoDevolucion = [{id:'S', valor:'Sinpe'},{id:'T', valor:'Transferencia'},{id:'D', valor:'Deposito'}];
  constructor(
 public modalCtrl:ModalController,
 public usuariosService:UsuariosService,
 public anticiposService:AnticiposService,
 public controlGastosService:ControlGastosService,
 public alertasService:AlertasService,
 public gastosConAnticipoService:GastosConAnticipoService,
 public sobrantesService:SobrantesService,
 public emailService:EmailService,
 public gastosSinAnticipoService:GastosSinAnticipoService,
 public cd:ChangeDetectorRef   
  ) { }

  ngOnInit() {
  }
  regresar(){
this.modalCtrl.dismiss();
  }

  metodoPago(fLiquidacion: NgForm){
console.log('fLiquidacion',fLiquidacion)
console.log('fLiquidacion.value.metodoDevolucion', fLiquidacion.value.metodoDevolucion)
this.sobrante.metodO_DEVOLUCION = fLiquidacion.value.metodoDevolucion;
this.sobrante.cuenta = null;
this.sobrante.telefono = null;
this.cd.detectChanges();
  }
  async  liquidarGastos (fLiquidacion: NgForm,data?) {
    this.controlGastosService.anticipoLiquidado = true;
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
    
    
     }
     
      }
    
}
