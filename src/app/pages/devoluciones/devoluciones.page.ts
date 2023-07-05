import { Component, OnInit } from '@angular/core';
import { Devoluciones } from 'src/app/models/devoluciones';
import { AlertasService } from 'src/app/services/alertas.service';
import { DevolucionesService } from 'src/app/services/devoluciones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.page.html',
  styleUrls: ['./devoluciones.page.scss'],
})
export class DevolucionesPage implements OnInit {
  devoluciones:Devoluciones[]=[]
  constructor(
  public alertasService:AlertasService,
  public devolucionesService:DevolucionesService,
  public usuariosService:UsuariosService  
  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos...');
    this.devolucionesService.syncGetDevolucionUsuarioToPromise(this.usuariosService.usuario.usuario).then(devoluciones =>{
      this.devoluciones = devoluciones;
      this.alertasService.loadingDissmiss();
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('SD1', 'Lo sentimos algo salio mal!..')
    })
  }

}
