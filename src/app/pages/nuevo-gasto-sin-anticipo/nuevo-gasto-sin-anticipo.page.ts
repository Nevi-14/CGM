import { Component, Input, OnInit, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { AlertController, IonInput, ModalController, PopoverController } from '@ionic/angular';
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
import { ColonesPipe } from 'src/app/pipes/colones.pipe';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { CompaniasService } from 'src/app/services/companias.service';

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

  focused: boolean;
  file = null;
  nuevoGasto :GastoSinAnticipo  = {
    id:null,
    compania:null,
    iD_TIPO_GASTO: null,
    modificadO_POR :null,
    moneda:'¢',
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
    porcentajeiva:null,
    montoiva:null,
    estatus:'P',
    observaciones: 'observaciones'
 }
 companias = []
 tipoMoneda = [{id:'$',valor:'Dolares'},{id:'¢',valor:'Colones'}]
 formaPago = [{id:'true',valor:'Tarjeta'},{id:'false',valor:'Efectivo'}]
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
    public tiposGastosService:TiposGastosService,
    public alertCtrl: AlertController,
    public gastosConAnticipoService:GastosConAnticipoService,
    public companiasService:CompaniasService

  ) { }
  ngOnInit() {
    this.companiasService.syncGetCompaniasToPromise().then(companias =>{

      companias.forEach( compania =>{
let data = {
  id:compania.nombre,
  valor:compania.nombre
}
this.companias.push(data)
      })
    })

    console.log('anticipo', this.anticiposService.anticipo)
    console.log('vista', this.anticiposService.vistaAnticipo)
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
      this.nuevoGasto.moneda= this.anticiposService.anticipo.moneda;
      this.nuevoGasto.monto=  this.gastoConAnticipo.monto - this.anticiposService.vistaAnticipo.restante;
      this.file = this.gastoConAnticipo.adjunto;
      this.alertasService.message('SD1 Móvil',`Se ha generado un nuevo gasto sin anticipo, el cual va a cubrir el monto faltante de su anticipo, el monto original es de ${ColonesPipe.prototype.transform(this.gastoConAnticipo.monto, 2 , '.' , ',' , this.anticiposService.anticipo.moneda)} el cual supera el disponible por ende el faltante es de ${ColonesPipe.prototype.transform(this.gastoConAnticipo.monto - this.anticiposService.vistaAnticipo.restante, 2 , '.' , ',' , this.anticiposService.anticipo.moneda)}`)
    }else{
      this.borrarAdjunto();
    }
  }
  borrarAdjunto(){
    if(this.gestorImagenesService.images.length > 0){
      this.gestorImagenesService.deleteImage(this.gestorImagenesService.images[0])
    }
  }
   registrarGasto(fRegistroGasto: NgForm) {
    if(this.gastoConAnticipo){
     return this.alertaGastoSinAnticipoFaltante(fRegistroGasto);
    }
    let gasto = fRegistroGasto.value;
    this.nuevoGasto.proveedor =  gasto.proveedor
    this.nuevoGasto.referencia =  gasto.referencia
    this.nuevoGasto.moneda =  gasto.moneda
    this.nuevoGasto.monto =  gasto.monto
    this.nuevoGasto.descripcion =  gasto.descripcion
    this.nuevoGasto.compania = gasto.compania;
    this.nuevoGasto.porcentajeiva = gasto.porcentajeiva;
    this.nuevoGasto.montoiva = gasto.montoiva;
 

    if (!this.nuevoGasto.referencia || !this.nuevoGasto.monto || !this.nuevoGasto.proveedor) {
      this.usuariosService.presentAlert('SD1 Móvil', 'Todos los campos son requeridos!..');
      return
    }
 
    
    this.alertasService.presentaLoading('Guardando cambios...')
    this.nuevoGasto.iD_TIPO_GASTO = this.tiposGastosService.tipo.id;
 
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
  async alertaGastoSinAnticipoFaltante(fRegistroGasto:NgForm) {
    this.anticiposService.vistaAnticipo = null;
    const alert = await this.alertCtrl.create({
      header: 'SD1 Móvil',
      message:'Selecciona continuar si desea registrar el gasto y cerrar la guia existente!..',
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
          handler: () => {
            let gasto = fRegistroGasto.value;
            this.nuevoGasto.proveedor =  gasto.proveedor
            this.nuevoGasto.referencia =  gasto.referencia
            this.nuevoGasto.moneda =  gasto.moneda
            this.nuevoGasto.monto =  gasto.monto
            this.nuevoGasto.descripcion =  gasto.descripcion
            this.nuevoGasto.justificacion =  `Gasto sin anticipo faltante, referencia  anticipo ${this.anticiposService.vistaAnticipo.numerO_TRANSACCION}`
         
        
            if (!this.nuevoGasto.referencia || !this.nuevoGasto.monto || !this.nuevoGasto.proveedor) {
              this.usuariosService.presentAlert('SD1 Móvil', 'Todos los campos son requeridos!..');
              return
            }
         
            
            this.alertasService.presentaLoading('Guardando cambios...')
            this.nuevoGasto.iD_TIPO_GASTO = this.tiposGastosService.tipo.id;    
            this.nuevoGasto.identificador = String(this.anticiposService.vistaAnticipo.iD_LINEA);
            if(this.gestorImagenesService.images.length > 0){
              this.nuevoGasto.adjunto = this.gestorImagenesService.images[0].fileName
            }
            this.gastosSinAnticipoService.postGastoSinAnticipo([this.nuevoGasto]).subscribe(
              async (resp) => {
                this.gastoConAnticipo.iD_TIPO_GASTO = this.tiposGastosService.tipo.id; 
                this.gastoConAnticipo.proveedor =  gasto.proveedor
                this.gastoConAnticipo.referencia =  gasto.referencia
                let restante = this.gastoConAnticipo.monto - this.anticiposService.vistaAnticipo.restante;
                this.gastoConAnticipo.monto =    this.gastoConAnticipo.monto  - restante;
                this.gastoConAnticipo.descripcion =  gasto.descripcion;
                let anticipos = await this.anticiposService.syncGetUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.id);
                let anticipo = anticipos[0];
                let lineaAnticipos = await this.anticiposService.syncGetLineaUsuarioAnticipoBYId(this.anticiposService.vistaAnticipo.iD_LINEA);
            
                let lineaAnticipo = lineaAnticipos[0];
            
                // anticipo
                anticipo.restante -= this.gastoConAnticipo.monto;
                anticipo.utilizado = anticipo.monto - anticipo.restante;
            
               // linea
            
                lineaAnticipo.restante = 0;
                lineaAnticipo.utilizado =  lineaAnticipo.monto;
            
            // anticipo vista
            
            this.anticiposService.vistaAnticipo.restante -= this.nuevoGasto.monto;
            this.anticiposService.vistaAnticipo.utilizado = this.anticiposService.vistaAnticipo.monto - this.anticiposService.vistaAnticipo.restante;
            
                if (this.gestorImagenesService.images.length > 0) {
                  this.nuevoGasto.adjunto = this.gestorImagenesService.images[0].fileName
            
                }
                this.gastosConAnticipoService.syncPostGastoConAnticipoToPromise([this.gastoConAnticipo]).then(
                  async (resp) => {
                    await this.anticiposService.syncPutAnticipoToPromise(anticipo);
                    await this.anticiposService.syncPutLineaAnticipoToPromise(lineaAnticipo)
           
                    if(this.gestorImagenesService.images.length > 0){
                      await  this.gestorImagenesService.startUpload();
                     }
                     this.controlGastosService.limpiarDatosIniciales();
                     this.alertasService.loadingDissmiss();
                     this.usuariosService.presentAlert('SD1 Móvil', 'Gasto Registrado');
                    this.modalCtrl.dismiss({ 'check': true });
           
                  }, error => {
                    this.usuariosService.loadingDissmiss();
                    this.usuariosService.presentAlert('SD1 Móvil', 'Lo sentimos algo salio mal..');
                  }
                )


              }, error => {
                this.alertasService.loadingDissmiss();
                this.usuariosService.presentAlert('SD1 Móvil', 'Lo sentimos algo salio mal..');
              }
            )
        
          },
        },
      ],
    });
  
    await alert.present();
  
    const { role } = await alert.onDidDismiss();
   
  }

 async tiposGastosModal(){
  await  this.tiposGastosService.tiposGastosModal()

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
