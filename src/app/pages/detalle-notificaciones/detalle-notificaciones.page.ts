import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Notificaciones } from 'src/app/models/notificaciones';
import { AlertasService } from 'src/app/services/alertas.service';
import { GestorImagenesService } from 'src/app/services/gestor-imagenes.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-detalle-notificaciones',
  templateUrl: './detalle-notificaciones.page.html',
  styleUrls: ['./detalle-notificaciones.page.scss'],
})
export class DetalleNotificacionesPage implements OnInit {
@Input() notificacion:Notificaciones
readonly:boolean = true;
file = null;
  constructor(
  public modalCtrl:ModalController,
  public alertasService:AlertasService,
  public notificacionesService:NotificacionesService,
  public gestorImagenesService:GestorImagenesService ,
  public changeDetector:ChangeDetectorRef 
  ) { }

  ngOnInit() {
    console.log(this.notificacion)
  }

actualizarNotificacion(fNotificaciones:NgForm){
  this.notificacion.estatus = 'F';
  this.alertasService.presentaLoading('Guardando cambios!..');
  this.notificacionesService.syncPutNotificacionToPromise(this.notificacion).then(resp =>{
    this.alertasService.loadingDissmiss()
    this.modalCtrl.dismiss(true);
    this.alertasService.message('SD1', 'Notificacion recibida!..')
  }, error =>{
    this.alertasService.loadingDissmiss()
  })
}
borrarAdjunto() {
  if (this.gestorImagenesService.images.length > 0) {
    this.gestorImagenesService.deleteImage(this.gestorImagenesService.images[0])
  }
}

adjuntarImagen( ){
  
  this.gestorImagenesService.alertaCamara().then(resp =>{
    console.log('done')
    console.log('resp')
    this.changeDetector.detectChanges();
  
   })
 
}
  regresar(){
    this.modalCtrl.dismiss();

  }
}
