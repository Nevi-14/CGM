import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { GastoSinAnticipo } from 'src/app/models/gastoSinAnticipo';
import { TiposGastosPage } from '../tipos-gastos/tipos-gastos.page';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { TiposGastos } from 'src/app/models/tiposGastos';
import { AlertasService } from 'src/app/services/alertas.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { GestorImagenesService } from 'src/app/services/gestor-imagenes.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-editar-gasto-sin-anticipo',
  templateUrl: './editar-gasto-sin-anticipo.page.html',
  styleUrls: ['./editar-gasto-sin-anticipo.page.scss'],
})
export class EditarGastoSinAnticipoPage implements OnInit {
@Input() nuevoGasto:GastoSinAnticipo
@Input() tipo:TiposGastos;
file = null;
  constructor(
public alertasService:AlertasService,
public gastosSinAnticiposService:GastosSinAnticipoService,
public  controlGastosService:ControlGastosService,
public gestorImagenesService:GestorImagenesService,
public changeDetector:ChangeDetectorRef,
public modalctrl:ModalController,
public popOverCtrl:PopoverController,
public tiposGastosService:TiposGastosService,
public usuariosService:UsuariosService
    
  ) { }

  ngOnInit() {
    console.log(this.nuevoGasto)
    let i = this.tiposGastosService.tiposGastos.findIndex(e => e.id == this.nuevoGasto.iD_TIPO_GASTO);
    if(i >=0) this.tiposGastosService.tipo = this.tiposGastosService.tiposGastos[i];
  }
  async actualziarGasto(fRegistroGasto: NgForm) {
    let gasto = fRegistroGasto.value;
    this.nuevoGasto.proveedor =  gasto.proveedor
    this.nuevoGasto.referencia =  gasto.referencia
    this.nuevoGasto.moneda =  gasto.moneda
    this.nuevoGasto.monto =  gasto.monto
    this.nuevoGasto.descripcion =  gasto.descripcion

    this.alertasService.presentaLoading('Guardando cambios...')
    this.nuevoGasto.iD_TIPO_GASTO = this.tiposGastosService.tipo.id;
    if(this.gestorImagenesService.images.length > 0){
      this.nuevoGasto.adjunto = this.gestorImagenesService.images[0].fileName

    }

    await this.gastosSinAnticiposService.syncPutGastoSinAnticipoToPromise(this.nuevoGasto);

    this.controlGastosService.limpiarDatos();
    await this.controlGastosService.syncTiposGastos();
    this.controlGastosService.gastoSinAnticipo = true;
    await this.controlGastosService.sincronizarGastos();

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
      console.log('done')
      console.log('resp')
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
 
      this.nuevoGasto.fecha = data.fecha;
      this.nuevoGasto.fecha.setHours(0, 0, 0, 0);


    }
  }

  async tiposGastosModal(){
  await  this.tiposGastosService.tiposGastosModal()

  }
  async deleteGastoSinAnticipo(){
    await this.gastosSinAnticiposService.syncDeleteGastoSinAnticipoToPromise(this.nuevoGasto.id);
    this.controlGastosService.accionGasto  = true;
     //await this.anticiposService.sincronizarDatos();
     //await this.sincronizar()
     this.controlGastosService.sincronizarGastos();
   
     this.modalctrl.dismiss(true)
     this.alertasService.loadingDissmiss();
   }
}
