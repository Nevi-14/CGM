import { Component, Input, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { ConfiguracionesServiceService } from 'src/app/services/configuraciones-service.service';


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
    public configuracionesService: ConfiguracionesServiceService
    
      ) {}

  ngOnInit() {}
  toggle(){
 this.configuracionesService.menu = !this.configuracionesService.menu ;
    this.menuCtrl.toggle('myMenu');
  
  }
}
