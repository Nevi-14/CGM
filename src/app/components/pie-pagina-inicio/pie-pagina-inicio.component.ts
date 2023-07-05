import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionesServiceService } from 'src/app/services/configuraciones-service.service';

@Component({
  selector: 'app-pie-pagina-inicio',
  templateUrl: './pie-pagina-inicio.component.html',
  styleUrls: ['./pie-pagina-inicio.component.scss'],
})
export class PiePaginaInicioComponent implements OnInit {
 
  constructor(
public configuracionesService:ConfiguracionesServiceService,
public router:Router
    
  ) { }

  ngOnInit() {}
  menuAction(url, value) {
    this.configuracionesService.segment = value;
    //this.configuracionesService.menu = !this.configuracionesService.menu ;
    //this.menuCtrl.toggle('myMenu');
    //alert('hello')
    console.log('url', url)
   
  
    this.router.navigateByUrl(url, { replaceUrl: true })
  
  }
}
