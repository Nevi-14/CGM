import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BdService } from 'src/app/services/bd.service';
import { D1Service } from 'src/app/services/d1.service';

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

  showPass = false;
  lock     = false;
  loginUser: login;


  constructor( private bd: BdService,
               private d1: D1Service,
               private modalCtrl: ModalController ) { }

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
      this.d1.presentaLoading('Espere...');
      this.bd.getAut(this.loginUser.usuario, this.loginUser.password).subscribe(
        resp => {
          this.d1.loadingDissmiss();
          if (resp.length > 0){
            const i = resp.findIndex( x => x.rol === 'A' || x.rol === 'C');
            if (i >= 0){
              console.log(resp);
              this.d1.usuario = resp[i];
              this.d1.guardarUsuario();
              this.modalCtrl.dismiss({'Aut': true});
            } else {
              this.d1.presentAlert('Autenticación', 'El usuario no posee permisos de ingreso...!!!');
            }
          } else {
            this.d1.presentAlert('Autenticación', 'El usuario no existe...!!!');
            console.log('Usuario no existe')
          }
        }, error => {
          this.d1.loadingDissmiss();
          console.log('Aplicación sin acceso a la BD', error.message);
          this.d1.presentAlert('Autenticación', 'Aplicación sin acceso a la BD...!!!');
        }
      )
    }
  }

  send(){}

  salir(){
    this.modalCtrl.dismiss({'Aut': false});
  }

}
