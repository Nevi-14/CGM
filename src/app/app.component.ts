import { Component, HostListener, OnInit } from '@angular/core';
import { AlertasService } from './services/alertas.service';
import { MenuController, Platform } from '@ionic/angular';
import { StatusBar} from '@capacitor/status-bar';
import { Router } from '@angular/router';
import { ConfiguracionesServiceService } from './services/configuraciones-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  today:Date = new Date();
  y = this.today.getFullYear();
  m = this.today.getMonth();
  value1 = new Date(this.y, this.m , 1).toISOString();
  value2 = new Date(this.y, this.m+1 , 0).toISOString();
  public appPages = [
    { title: 'Inicio', url: '/inicio/detalle', icon: 'home' },

    { title: 'Gestión Anticipos', url: '/inicio/control-anticipos', icon: 'document-text' },
    //{ title: 'Viáticos', url: '/inicio/control-viaticos', icon: 'cash' },
    { title: 'Gastos Sin Anticipos', url: '/inicio/gastos-sin-anticipo', icon: 'wallet' },
    { title: 'Estados Cuenta', url: '/inicio/control-estados-cuenta', icon: 'card' },
    { title: 'Mi Perfil', url: 'perfil', icon: 'person' },
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
  ) {}

ngOnInit() {
  if(!this.platform.is('mobileweb')) {
    StatusBar.setOverlaysWebView({overlay:false})
    StatusBar.setBackgroundColor({color:'#36acc6'});
    
  }
  
}
// REMVOE MENU ON BIGGER SCREENS
menuAction(url) {
  this.class = false;
  this.configuracionesService.menu = false;
  if (url == 'perfil') {
   // this.perfil();
  } else if (url == 'salir') {
   // this.cerrarSesion();
  } else {
    this.router.navigateByUrl(url, { replaceUrl: true })
  }

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

@HostListener('window:resize', ['$event'])

private onResize(event) {

  this.width = event.target.innerWidth;

  this.toggleMenu();

}

}
