import {Component, HostListener } from '@angular/core';
import { EstadosCuentaPage } from '../estados-cuenta/estados-cuenta.page';
import { InformacionPage } from '../informacion/informacion.page';
import { MiPerfilPage } from '../mi-perfil/mi-perfil.page';
import { StatusBar } from '@capacitor/status-bar';
import { AlertasService } from 'src/app/services/alertas.service';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ConfiguracionesServiceService } from 'src/app/services/configuraciones-service.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {
  today:Date = new Date();
  y = this.today.getFullYear();
  m = this.today.getMonth();
  value1 = new Date(this.y, this.m , 1).toISOString();
  value2 = new Date(this.y, this.m+1 , 0).toISOString();
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    { title: 'Sobrantes', url: '/inicio/sobrantes', icon: 'cash' },
    { title: 'Devoluciones', url: '/inicio/devoluciones', icon: 'wallet' },
    { title: 'Estados De Cuenta', url: '/inicio/control-estados-cuenta', icon: 'card' },
    { title: 'Mi Perfil', url: 'perfil', icon: 'person' },
    { title: 'Información', url: 'informacion', icon: 'information-circle' },
    { title: 'Cerrar Sesión', url: 'salir', icon: 'exit' }
  ];
   class: boolean = false;
  width: number;
  url = '';
  showMenu = false;
  large: boolean;
  small: boolean;
  constructor(
    public alertasService:AlertasService,
    public platform: Platform,
    public router: Router,
    public menuCtrl: MenuController,
    public configuracionesService: ConfiguracionesServiceService,
    public usuariosService:UsuariosService,
    public modalCtrl:ModalController,
    public controlGastosService:ControlGastosService
  ) {}

ngOnInit() {
  if(!this.platform.is('mobileweb')) {
    StatusBar.setOverlaysWebView({overlay:false})
    StatusBar.setBackgroundColor({color:'#36acc6'});
    
  }
  
}
// REMVOE MENU ON BIGGER SCREENS
menuAction(url) {
  //this.configuracionesService.menu = !this.configuracionesService.menu ;
  this.menuCtrl.toggle('myMenu');
  //alert('hello')
  console.log('url', url)
 
  this.class = false;
  this.configuracionesService.menu = false;
  if (url == 'perfil') {
   this.miPerfil();
  } else if (url == 'salir') {
    this.cerrarSesion();
  }   else if (url == 'informacion') {
    this.informacion();
  }else if(url == '/inicio/control-estados-cuenta') {
 
this.estadosDeCuenta();
  }
  
  else {
    this.router.navigateByUrl(url, { replaceUrl: true })
  }

}
async miPerfil(){
  this.modalCtrl.dismiss();
  let modal = await this.modalCtrl.create({
    component: MiPerfilPage,

  })

  await modal.present();
  const { data } = await modal.onDidDismiss();
  if (data !== undefined) {
 
  }
}
async informacion(){
  this.modalCtrl.dismiss();
  let modal = await this.modalCtrl.create({
    component: InformacionPage,

  })

  await modal.present();
  const { data } = await modal.onDidDismiss();
  if (data !== undefined) {
 
  }
}
cerrarSesion() {
  this.controlGastosService.limpiarDatosIniciales()
  this.usuariosService.usuario = null;
  this.router.navigateByUrl('/');
}

openMenu() {
  if (!this.configuracionesService.menu) {
    this.class = true;
    this.menuCtrl.open();
    this.configuracionesService.menu = true;
  }

}

closeMenu() {
  if (this.configuracionesService.menu) {
    this.class = false;
    this.menuCtrl.close();
    this.configuracionesService.menu = false;
  }

}
toggleMenu() {

  if (this.width > 768) {
    this.large = true;
    this.small = false;
    //this.class = true;
    // this.menuCtrl.toggle('myMenu');
    this.small = false;
  } else {
    this.class = false;
    this.large = false;
    this.small = true;
    // this.menuCtrl.toggle('myMenu');




  }

}

toggle() {
  this.class = true;
  this.menuCtrl.toggle('myMenu');

  this.configuracionesService.menu = !this.configuracionesService.menu;

}
// CHECKS SCREEN RESIZE LIVE
async estadosDeCuenta(){
  this.modalCtrl.dismiss();
  let modal = await this.modalCtrl.create({
    component: EstadosCuentaPage,

  })

  await modal.present();
  const { data } = await modal.onDidDismiss();
  if (data !== undefined) {
 
  }
}
@HostListener('window:resize', ['$event'])

private onResize(event) {

  this.width = event.target.innerWidth;

  this.toggleMenu();

}

}
