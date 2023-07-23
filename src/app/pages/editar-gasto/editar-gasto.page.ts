import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { GastoConAnticipo } from 'src/app/models/gastoConAnticipo';
import { AlertasService } from 'src/app/services/alertas.service';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { GestorImagenesService } from 'src/app/services/gestor-imagenes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { TiposGastos } from 'src/app/models/tiposGastos';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-editar-gasto',
  templateUrl: './editar-gasto.page.html',
  styleUrls: ['./editar-gasto.page.scss'],
})
export class EditarGastoPage implements OnInit {
  @Input() nuevoGasto: GastoConAnticipo
  montoAnterior = 0;
  restanteAnterior = 0;
  @Input() tipo:TiposGastos;
  file = null;

  constructor(
    public modalctrl: ModalController,
    public gastosConAnticipoService: GastosConAnticipoService,
    public gestorImagenesService: GestorImagenesService,
    public changeDetector: ChangeDetectorRef,
    public alertasService: AlertasService,
    public anticiposService: AnticiposService,
    public usuariosService: UsuariosService,
    public popOverCtrl:PopoverController,
    public tiposGastosService:TiposGastosService,
    public  controlGastosService:ControlGastosService
  ) { }

  async ngOnInit() {
    this.montoAnterior = this.nuevoGasto.monto;
    let i = this.tiposGastosService.tiposGastos.findIndex(e => e.id == this.nuevoGasto.iD_TIPO_GASTO);
    if(i >=0) this.tiposGastosService.tipo = this.tiposGastosService.tiposGastos[i];
    console.log(this.nuevoGasto)

    if(this.nuevoGasto.estatus == 'R'){
     // this.alertasService.message('SD1 Móvil', this.nuevoGasto.observaciones)
    }
  }

  async actualziarGasto(fRegistroGasto: NgForm) {
    let gasto = fRegistroGasto.value;
    this.nuevoGasto.proveedor =  gasto.proveedor
    this.nuevoGasto.referencia =  gasto.referencia
    this.nuevoGasto.monto =  Number(gasto.monto)
    this.nuevoGasto.descripcion =  gasto.descripcion
    this.nuevoGasto.porcentajeiva =Number( gasto.porcentajeiva);
    this.nuevoGasto.montoiva = Number( gasto.montoiva);
    if(this.nuevoGasto.monto < 0  || this.nuevoGasto.monto > this.anticiposService.vistaAnticipo.restante){

      return this.alertasService.message('SD1','Lo sentimos el monto excede el limite de disponible')
    }
    this.alertasService.presentaLoading('Guardando cambios...')
    this.nuevoGasto.iD_TIPO_GASTO = this.tiposGastosService.tipo.id;
    this.controlGastosService.accionGasto = true;
    if(this.gestorImagenesService.images.length > 0){
      this.nuevoGasto.adjunto = this.gestorImagenesService.images[0].fileName

    }
    await this.gastosConAnticipoService.syncPutGastoConAnticipoToPromise(this.nuevoGasto);

    let anticipos = await this.anticiposService.syncGetUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.id);
    let anticipo = anticipos[0];
    anticipo.utilizado -= this.montoAnterior;
    anticipo.utilizado += this.nuevoGasto.monto;
    
    anticipo.restante = anticipo.monto - anticipo.utilizado;



  

    let lineas = await this.anticiposService.syncGetLineaUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.iD_LINEA);
    await this.anticiposService.syncPutAnticipoToPromise(anticipo);
    let linea = lineas[0];
    console.log('lineas', lineas)
    console.log('linea', linea)
    linea.utilizado -= this.montoAnterior;
    linea.utilizado += this.nuevoGasto.monto;
    linea.restante = linea.monto - linea.utilizado;

    this.anticiposService.vistaAnticipo.utilizado  -= this.montoAnterior;
    this.anticiposService.vistaAnticipo.utilizado  += this.nuevoGasto.monto;

    this.anticiposService.vistaAnticipo.restante =  linea.monto - linea.utilizado;  
 

    await this.anticiposService.syncPutLineaAnticipoToPromise(linea);
   this.controlGastosService.sincronizarGastos();
    this.regresar();
    this.alertasService.loadingDissmiss();
    this.alertasService.message('SD1 Móvil', 'Gasto Actualiziado!.')
  }
  borrarImagen() {

    this.gestorImagenesService.reset()
  }

  cargarImagen() {
    this.gestorImagenesService.startUpload();
  }
  adjuntarImagen( ){
    
    this.gestorImagenesService.alertaCamara().then(resp =>{
      this.changeDetector.detectChanges();
    
     })
   
  }


  regresar() {
    this.modalctrl.dismiss();
  }
  borrarAdjunto() {
    if (this.gestorImagenesService.images.length > 0) {
      this.gestorImagenesService.deleteImage(this.gestorImagenesService.images[0])
    }
  }


  async calendarioPopOver() {
    const popover = await this.popOverCtrl.create({
      component: CalendarioPopoverPage,
      cssClass: 'my-custom-class',
      translucent: true,
      componentProps: {
        fecha: this.nuevoGasto.fecha
      }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data != undefined) {
      let fechaInicial = new Date(this.anticiposService.vistaAnticipo.fechA_INICIAL);
      fechaInicial.setHours(0, 0, 0, 0);
      let fechaCorte = new Date(this.anticiposService.vistaAnticipo.fechA_FINAL);
      fechaCorte.setHours(0, 0, 0, 0);
      let nuevaFecha = new Date(data.fecha);
      nuevaFecha.setHours(0, 0, 0, 0);
      if (nuevaFecha.getTime() > fechaCorte.getTime()) {
        this.usuariosService.presentAlert('SD1 Móvil', 'La fecha no pude ser mayor que la fecha de corte.');
        return
      }
      if (nuevaFecha.getTime() < fechaInicial.getTime()) {
        this.usuariosService.presentAlert('SD1 Móvil', 'La fecha no pude ser menor que la fecha de inicial.');
        return
      }
      this.nuevoGasto.fecha = data.fecha;
      this.nuevoGasto.fecha.setHours(0, 0, 0, 0);


    }
  }


  async tiposGastosModal(){
  await  this.tiposGastosService.tiposGastosModal()

  }


  async deleteGastoConAnticipo(){
    this.alertasService.presentaLoading('Eliminando Gasto!')
    let anticipos = await this.anticiposService.syncGetUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.id);
      let anticipo = anticipos[0];
      anticipo.utilizado -= this.nuevoGasto.monto;
      anticipo.restante = anticipo.monto - anticipo.utilizado;
      this.anticiposService.vistaAnticipo.utilizado -=  this.nuevoGasto.monto;
      this.anticiposService.vistaAnticipo.restante = anticipo.monto - anticipo.utilizado;
      
    
      
      let lineas = await this.anticiposService.syncGetLineaUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.iD_LINEA);
      await this.anticiposService.syncPutAnticipoToPromise(anticipo);
      let linea = lineas[0];
      linea.utilizado -=  this.nuevoGasto.monto;
      linea.restante = linea.monto - linea.utilizado;
      await this.anticiposService.syncPutLineaAnticipoToPromise(linea);
    this.gastosConAnticipoService.syncDeleteGastoConAnticipoToPromise( this.nuevoGasto.id);
    this.controlGastosService.accionGasto = true;
    this.alertasService.loadingDissmiss();
    this.modalctrl.dismiss(true);
     
  }


}
