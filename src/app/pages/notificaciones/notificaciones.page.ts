import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Notificaciones } from 'src/app/models/notificaciones';
import { AlertasService } from 'src/app/services/alertas.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DetalleNotificacionesPage } from '../detalle-notificaciones/detalle-notificaciones.page';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  notificaciones:Notificaciones[]=[]
  constructor(
public modalCtrl:ModalController,
public notificacionesService:NotificacionesService,
public alertasService:AlertasService,
public usuariosSevice:UsuariosService

  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos...');
    this.notificacionesService.syncGetNotificacionesUsuarioToPromise(this.usuariosSevice.usuario.usuario, 'P').then( notificaciones =>{
      this.notificaciones = notificaciones;
      this.notificacionesService.notificaciones = notificaciones;
      this.alertasService.loadingDissmiss();
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('SD1 Móvil','Lo sentimos algo salio mal!...')
    })
  }


  regresar(){
this.modalCtrl.dismiss();
  }

  async detalle(notificacion:Notificaciones) {


    let modal = await this.modalCtrl.create({
      component: DetalleNotificacionesPage,
      mode: 'ios',
      componentProps: {
        notificacion: notificacion
      }
    })

    modal.present();
    const { data } = await modal.onDidDismiss();

    if (data != undefined) {

    }
  }

}
