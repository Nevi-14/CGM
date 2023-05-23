import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
 public modalCtrl:ModalController,
 public sobrantesService:SobrantesService,
 public alertasService:AlertasService,
 public usuariosService:UsuariosService   
  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos..')
   this.sobrantesService.syncGetSobranteUsuarioToPromise(this.usuariosService.usuario.usuario).then(resp =>{
      this.alertasService.loadingDissmiss();
      this.sobrantes = resp;
      console.log('resp',resp)
    }, error =>{
      this.alertasService.loadingDissmiss();
      console.log('error',error)
    })


  }
  regresar(){
this.modalCtrl.dismiss();
    
  }
  detalleSobrante(sobrante:Sobrantes){
if(sobrante.estatus == 'P') this.alertasService.message('SD1 Móvil','Lo sentimos no se puede mostrar la información, hasta que se apruebe el sobrante..')
  }
}
