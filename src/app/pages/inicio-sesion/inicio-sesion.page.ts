import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertasService } from '../../services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

interface login{
  usuario: string,
  password: string
}

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {
  focused: boolean;
  showPass = false;
  lock     = false;
  loginUser: login;


  constructor(
               private usuariosService:UsuariosService,
               private modalCtrl: ModalController,
               private router: Router,
               private alertasService: AlertasService
                ) { }

  ngOnInit() {
    this.loginUser = {
      usuario: '',
      password: ''
    }
  }

  login(fLogin: NgForm){
    console.log('fLogin', fLogin);
    if (fLogin.valid){
      console.log('Login')
      this.usuariosService.presentaLoading('Espere...');
      this.usuariosService.syncGetExactusToPromise(this.loginUser.usuario).then(
        resp => {
          this.usuariosService.loadingDissmiss();
          if (resp.length > 0){
            this.router.navigateByUrl('/inicio', {replaceUrl:true});
            this.usuariosService.usuario = resp[0];
            this.usuariosService.guardarUsuario();

          } else {
            this.usuariosService.presentAlert('SD1 Móvil', 'Usuario o contraseña incorrectos..!!!');
            console.log('Usuario no existe')
          }
        }, error => {
          this.usuariosService.loadingDissmiss();
          console.log('Aplicación sin acceso a la BD', error.message);
          this.usuariosService.presentAlert('SD1 Móvil', 'Aplicación sin acceso a la BD...!!!');
        }
      )
    }
  }

  send(){
    this.alertasService.message('SD1 Móvil', 'Opción no disponible!.')
  }

  salir(){
    this.modalCtrl.dismiss({'Aut': false});
  }
  onBlur(event: any) {
    const value = event.target.value;

    if (!value) {
      this.focused = false;
    }
  }
}
