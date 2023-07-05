import { Component, OnInit } from '@angular/core';
import { Sobrantes } from 'src/app/models/sobrantes';
import { AlertasService } from 'src/app/services/alertas.service';
import { SobrantesService } from 'src/app/services/sobrantes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-sobrantes',
  templateUrl: './sobrantes.page.html',
  styleUrls: ['./sobrantes.page.scss'],
})
export class SobrantesPage implements OnInit {
sobrantes:Sobrantes[]=[]
  constructor(
  public alertasService:AlertasService,
  public sobrantesService:SobrantesService,
  public usuariosService:UsuariosService  
  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos...');
    this.sobrantesService.syncGetSobranteUsuarioToPromise(this.usuariosService.usuario.usuario).then(sobrantes =>{
      this.sobrantes = sobrantes;
      this.alertasService.loadingDissmiss();
    }, error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('SD1', 'Lo sentimos algo salio mal!..')
    })
  }

}
