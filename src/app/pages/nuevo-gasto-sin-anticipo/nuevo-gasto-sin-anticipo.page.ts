import { Component, Input, OnInit, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { IonInput, ModalController, PopoverController } from '@ionic/angular';
import { anticiposLineasView } from 'src/app/models/anticiposLineasView';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { GestorImagenesService } from 'src/app/services/gestor-imagenes.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { TiposGastos } from 'src/app/models/tiposGastos';
import { GastoSinAnticipo } from 'src/app/models/gastoSinAnticipo';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { GastoConAnticipo } from 'src/app/models/gastoConAnticipo';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-nuevo-gasto-sin-anticipo',
  templateUrl: './nuevo-gasto-sin-anticipo.page.html',
  styleUrls: ['./nuevo-gasto-sin-anticipo.page.scss'],
})
export class NuevoGastoSinAnticipoPage implements OnInit {
  @Input() anticipo: anticiposLineasView
  @Input() gastoConAnticipo:GastoConAnticipo
  @ViewChildren('input') input:Input | any
  @ViewChildren('label') label:Input | any

focuse = [
  {focus1:true},
  {focus2:true},
  {focus3:null},
  {focus4:null},
  {focus5:null},
  {focus6:null},
  {focus7:null},
  {focus8:null}
]
  focused: boolean;
  file = null;
  nuevoGasto :GastoSinAnticipo  = {
    id:null,
    iD_TIPO_GASTO: null,
    modificadO_POR :null,
    moneda:null,
    fecha: new Date(),
    fechA_INICIAL:this.controlGastosService.fechaInicioS,
    fechA_FINAL:this.controlGastosService.fechaFinS,
    identificador:null,
    cuentA_COSTOS: this.usuariosService.usuario.centrO_COSTO,
    tarjeta:false,
    usuario: this.usuariosService.usuario.usuario,
    referencia: null,
    proveedor: '',
    justificacion: 'justificacion',
    descripcion: null,
    adjunto:null,
    monto: null,
    estatus:'P',
    observaciones: 'observaciones'
 }

  tiposGastos: TiposGastos[] = [];
  constructor(
    public usuariosService:UsuariosService,
    public modalCtrl: ModalController,
    public popOverCtrl: PopoverController,
    public anticiposService: AnticiposService,
    public gestorImagenesService: GestorImagenesService,
    public changeDetector: ChangeDetectorRef,
    public gastosSinAnticipoService:GastosSinAnticipoService,
    public alertasService: AlertasService,
    public controlGastosService:ControlGastosService,
    public tiposGastosService:TiposGastosService

  ) { }
  ngOnInit() {
    this.nuevoGasto.fecha.setHours(0, 0, 0, 0);
    this.tiposGastos = JSON.parse(localStorage.getItem('usuariosServicetiposGasto')) || [];
    this.borrarAdjunto();

    this.nuevoGasto.fecha.setHours(0, 0, 0, 0);
    this.tiposGastos = JSON.parse(localStorage.getItem('usuariosServicetiposGasto')) || [];
    
    if(this.gastoConAnticipo){
      this.nuevoGasto.fecha = this.gastoConAnticipo.fecha;
      this.nuevoGasto.referencia = this.gastoConAnticipo.referencia;
      this.nuevoGasto.proveedor= this.gastoConAnticipo.proveedor;
      this.nuevoGasto.descripcion= this.gastoConAnticipo.descripcion;
      this.nuevoGasto.monto= this.gastoConAnticipo.monto;
      this.file = this.gastoConAnticipo.adjunto;
    }else{
      this.borrarAdjunto();
    }
  }
  borrarAdjunto(){
    if(this.gestorImagenesService.images.length > 0){
      this.gestorImagenesService.deleteImage(this.gestorImagenesService.images[0])
    }
  }
  async salvar(fLogin: NgForm) {

    if (!this.nuevoGasto.referencia || !this.nuevoGasto.monto || !this.nuevoGasto.proveedor) {
      this.usuariosService.presentAlert('SD1 Móvil', 'Todos los campos son requeridos!..');
      return
    }
 
    this.alertasService.presentaLoading('Guardando cambios...')
    this.nuevoGasto.iD_TIPO_GASTO = this.tiposGastosService.tipo.id;
    this.controlGastosService.fechaInicioS.setHours(0, 0, 0, 0)
    this.controlGastosService.fechaFinS.setHours(0, 0, 0, 0)
    let identificador = this.controlGastosService.fechaInicioMes.split('T')[0]+this.controlGastosService.fechaFinMes.split('T')[0];
    this.nuevoGasto.identificador = identificador;
    if(this.gestorImagenesService.images.length > 0){
      this.nuevoGasto.adjunto = this.gestorImagenesService.images[0].fileName
    }
    this.gastosSinAnticipoService.postGastoSinAnticipo([this.nuevoGasto]).subscribe(
      async (resp) => {
  
 
        if(this.gestorImagenesService.images.length > 0){
          await  this.gestorImagenesService.startUpload();
         }
         this.controlGastosService.limpiarDatos();
         await this.controlGastosService.syncTiposGastos();
         this.controlGastosService.gastoSinAnticipo = true;
         await this.controlGastosService.sincronizarGastos();
         this.alertasService.loadingDissmiss();
         this.usuariosService.presentAlert('SD1 Móvil', 'Gasto Registrado');
        this.modalCtrl.dismiss({ 'check': true });
      }, error => {
        this.alertasService.loadingDissmiss();
        this.usuariosService.presentAlert('SD1 Móvil', 'Lo Sentimos algo salio mal..');
      }
    )

  }
 async tiposGastosModal(){
    this.focuse[2].focus3 = true
  await  this.tiposGastosService.tiposGastosModal()
  this.tiposGastosService.tipo ?  this.focuse[2].focus3 = true : this.focuse[2].focus3 = false
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  login(fLogin: NgForm){
    console.log(fLogin,'fLogin')
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
      let fechaInicial = new Date(this.controlGastosService.fechaInicioMes);
      fechaInicial.setHours(0, 0, 0, 0);
      let fechaCorte = new Date(this.controlGastosService.fechaFinMes);
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
      this.nuevoGasto.fecha = nuevaFecha;
      this.nuevoGasto.fecha.setHours(0, 0, 0, 0);


    }
  }
  regresar() {
    this.modalCtrl.dismiss()
  }
  borrarImagen(){

    this.gestorImagenesService.reset()
  }

  cargarImagen(){
    this.gestorImagenesService.startUpload();
  }
  adjuntarImagen( ){
    
    this.gestorImagenesService.alertaCamara().then(resp =>{
      console.log('done')
      console.log('resp')
      this.changeDetector.detectChanges();
      this.tiposGastosService.tipo ?  this.focuse[7].focus8 = true : this.focuse[7].focus8 = false
    
     })
   
  }

  onBlur(event: any) {
    const value = event.target.value;

    if (!value) {
      this.focused = false;
    }
  }
  onBlur2(index, event) {
  console.log(this.label._results, 'input')
  const value = event.target.value;

  this.label._results[index].nativeElement.classList.add('label-focused')
 
  if (!value) {
   
  this.label._results[index].nativeElement.classList.remove('label-focused')
 
  }

  }

 
}
