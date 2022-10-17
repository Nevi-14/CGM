import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Usuarios } from '../models/definiciones';

@Injectable({
  providedIn: 'root'
})
export class D1Service {

  usuario: Usuarios = {
    empleado: '',
    usuario:  '',
    clave:    '',
    email:    '',
    nombre:   '',
    rol:      '',
    fecha:    null,
  }

  loading: HTMLIonLoadingElement;
  isLoading = false;

  constructor( public loadingCtrl: LoadingController,
               public alertCtrl: AlertController  ) {
    if (localStorage.getItem('d1Usuario')){
      this.usuario = JSON.parse(localStorage.getItem('d1Usuario'));
    }
  }

  guardarUsuario(){
    localStorage.setItem('d1Usuario', JSON.stringify(this.usuario));
  }

  async presentaLoading( message: string ){
    this.isLoading = true;
    this.loadingCtrl.create({
      message: message ? message : 'Please wait...'
    }).then(loader => {
      loader.present().then(() => {
        if (!this.isLoading) {
          loader.dismiss();
        }
      });
    });
  }

  async loadingDissmiss(){
    this.isLoading = false;
    this.loadingCtrl.getTop().then(loader => {
      if (loader) {
        loader.dismiss();
      }
    });
  }

  async presentAlert( subHeader: string, message: string ) {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      subHeader,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
