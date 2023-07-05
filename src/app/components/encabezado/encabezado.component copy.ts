import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { NotificacionesPage } from 'src/app/pages/notificaciones/notificaciones.page';
import { ConfiguracionesServiceService } from 'src/app/services/configuraciones-service.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent implements OnInit {
@Input()titulo;
fecha = new Date().toLocaleDateString();
  constructor(
    public menuCtrl: MenuController,
    private plt:Platform,
    public configuracionesService: ConfiguracionesServiceService,
    public usuariosService:UsuariosService,
    public modalCtrl:ModalController,
    public notificacionesService:NotificacionesService,
    public router:Router
    
      ) {}

  ngOnInit() {
    this.notificacionesService.syncGetNotificacionesUsuarioToPromise(this.usuariosService.usuario.usuario,'P').then(notificaciones =>{
      this.notificacionesService.notificaciones = notificaciones;
    })
    
  }
  toggle(){
 this.configuracionesService.menu = !this.configuracionesService.menu ;
    this.menuCtrl.toggle('myMenu');

  
  }

  redirigir(ruta){
this.router.navigateByUrl(ruta,{replaceUrl:true})
  }
  async notificaciones() {
    let modal = await this.modalCtrl.create({
      component: NotificacionesPage,
      mode:'ios',
    })

    modal.present();
    const { data } = await modal.onDidDismiss();

    if (data != undefined) {
   
      }
  }
}
