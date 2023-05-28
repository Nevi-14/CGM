import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { anticiposLineasView } from 'src/app/models/anticiposLineasView';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { GestorImagenesService } from 'src/app/services/gestor-imagenes.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { TiposGastos } from 'src/app/models/tiposGastos';
import { GastoConAnticipo } from 'src/app/models/gastoConAnticipo';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { NuevoGastoSinAnticipoPage } from '../nuevo-gasto-sin-anticipo/nuevo-gasto-sin-anticipo.page';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-nuevo-gasto-anticipo',
  templateUrl: './nuevo-gasto-anticipo.page.html',
  styleUrls: ['./nuevo-gasto-anticipo.page.scss'],
})
export class NuevoGastoAnticipoPage implements OnInit {

  @Input() tipoGasto: TiposGastos
  @Input() anticipo: anticiposLineasView
  tipo: TiposGastos;
  file = null;
  items: number[] = new Array(1)
  focused:boolean = false;
  nuevoGasto: GastoConAnticipo = {
    id: null,
    iD_LINEA_ANTICIPO: this.anticiposService.vistaAnticipo.iD_LINEA,
    fecha: new Date(),
    tarjeta: false,
    usuario: this.usuariosService.usuario.usuario,
    referencia: null,
    iD_TIPO_GASTO: null,
    proveedor: null,
    justificacion: 'justificacion',
    descripcion: null,
    observaciones: null,
    adjunto: null,
    monto: null,
    estatus: 'P'

  }
  
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
  constructor(
    private usuariosService: UsuariosService,
    private modalCtrl: ModalController,
    public popOverCtrl: PopoverController,
    public anticiposService: AnticiposService,
    public gestorImagenesService: GestorImagenesService,
    public changeDetector: ChangeDetectorRef,
    public gastosConAnticipoService: GastosConAnticipoService,
    public alertasService: AlertasService,
    public controlGastosService: ControlGastosService,
    public alertCtrl: AlertController,
    public tiposGastosService: TiposGastosService

  ) { }

  ngOnInit() {
    this.nuevoGasto.fecha.setHours(0, 0, 0, 0);
    this.borrarAdjunto();
  }
  onBlur(event: any) {
    const value = event.target.value;

    if (!value) {
      this.focused = false;
    }
  }
  async salvar(fLogin: NgForm) {

    if (!this.nuevoGasto.referencia || !this.nuevoGasto.monto || !this.nuevoGasto.proveedor) {
      this.usuariosService.presentAlert('SD1 Móvil', 'Todos los campos son requeridos!..');
      return
    }
    if (this.nuevoGasto.monto > this.anticiposService.vistaAnticipo.restante) {
      this.Alerta();
      return
    }
    this.alertasService.presentaLoading('Guardando cambios...')
    this.nuevoGasto.iD_TIPO_GASTO = this.tiposGastosService.tipo.id
    let anticipos = await this.anticiposService.syncGetUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.id);
    let anticipo = anticipos[0];
    let lineaAnticipos = await this.anticiposService.syncGetLineaUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.iD_LINEA);
    let lineaAnticipo = lineaAnticipos[0];
    anticipo.utilizado += this.nuevoGasto.monto;
    anticipo.restante -= this.nuevoGasto.monto;
    lineaAnticipo.utilizado += this.nuevoGasto.monto;
    lineaAnticipo.restante -= this.nuevoGasto.monto;

    this.anticiposService.vistaAnticipo.utilizado += this.nuevoGasto.monto;
    this.anticiposService.vistaAnticipo.restante -= this.nuevoGasto.monto;

    if (this.gestorImagenesService.images.length > 0) {
      this.nuevoGasto.adjunto = this.gestorImagenesService.images[0].fileName

    }
    this.gastosConAnticipoService.syncPostGastoConAnticipoToPromise([this.nuevoGasto]).then(
      async (resp) => {
        await this.anticiposService.syncPutAnticipoToPromise(anticipo);
        await this.anticiposService.syncPutLineaAnticipoToPromise(lineaAnticipo)
        if (this.gestorImagenesService.images.length > 0) {
          await this.gestorImagenesService.startUpload();
        }
        this.usuariosService.loadingDissmiss();
      //  this.controlGastosService.sincronizarGastos();
        this.usuariosService.presentAlert('SD1 Móvil', 'Gasto Registrado');
        this.modalCtrl.dismiss({ 'check': true, });
      }, error => {
        this.usuariosService.loadingDissmiss();
        this.usuariosService.presentAlert('SD1 Móvil', 'ERROR sincronizando con la BD...!!!');
      }
    )


  }

  async Alerta() {
    let data1 = 0;
    const alert = await this.alertCtrl.create({
      header: 'SD1 Móvil',
      subHeader: 'El monto supera el disponible del anticipo!.',
      message: '¿Desea crear un gasto sin anticipo?',
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
          handler: () => {
            this.nuevoGasto.adjunto = this.file;
            this.gastoSinAnticipo()
          },
        },
      ],
    });

    alert.present();
  }
  async gastoSinAnticipo() {
    this.modalCtrl.dismiss(true);
    const modal = await this.modalCtrl.create({
      component: NuevoGastoSinAnticipoPage,
      mode: 'ios',
      componentProps: {
        gastoConAnticipo: this.nuevoGasto,
        tipoGasto: this.tipoGasto
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

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
        return   this.usuariosService.presentAlert('Alerta!', 'La fecha no pude ser mayor que la fecha de corte.');
        
      }
      if (nuevaFecha.getTime() < fechaInicial.getTime()) {
        return   this.usuariosService.presentAlert('Alerta!', 'La fecha no pude ser menor que la fecha de inicial.');
        
      }

      this.nuevoGasto.fecha = nuevaFecha;
      this.nuevoGasto.fecha.setHours(0, 0, 0, 0);

    }
  }

  regresar() {
    this.modalCtrl.dismiss();
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
      this.tiposGastosService.tipo ?  this.focuse[7].focus8 = true : this.focuse[7].focus8 = false
    
     })
   
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  borrarAdjunto() {
    if (this.gestorImagenesService.images.length > 0) {
      this.gestorImagenesService.deleteImage(this.gestorImagenesService.images[0])
    }
  }
  async tiposGastosModal(){
    this.focuse[2].focus3 = true
  await  this.tiposGastosService.tiposGastosModal()
  this.tiposGastosService.tipo ?  this.focuse[2].focus3 = true : this.focuse[2].focus3 = false
  }
  login(fLogin: NgForm){
console.log(fLogin,'fLogin')
  }
}
