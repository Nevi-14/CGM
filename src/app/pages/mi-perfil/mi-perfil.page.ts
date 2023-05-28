import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {

  constructor(
  public modalCtrl:ModalController,
  public usuariosService:UsuariosService  
  ) { }

  ngOnInit() {
  }
  regresar(){
    this.modalCtrl.dismiss();
  }
}
