import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UsuariosSoftland } from '../models/usuariosSoftland';
import { Usuarios } from '../models/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuario: UsuariosSoftland = {
    usuario: null,
    nombre:  null,
    clave:    null,
    cia:    null,
    correO_ELECTRONICO: null,
    centrO_COSTO: null
  }

  loading: HTMLIonLoadingElement;
  isLoading = false;

  constructor(
    
    public loadingCtrl: LoadingController,
               public alertCtrl: AlertController,
               public http: HttpClient  
               
               
               
               ) {
    if (localStorage.getItem('d1Usuario')){
      this.usuario = JSON.parse(localStorage.getItem('d1Usuario'));
    }
  }
  private getIRPURL( api: string, id: string ){
    let test: string = '';

    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preURL + test + environment.postURL + api + id;
    console.log(URL);
    return URL;
  }

 private getAut(usuario: string, clave: string){
    const URL = this.getIRPURL( environment.usuariosURL, `?usuario=${usuario}&clave=${clave}` );
    return this.http.get<Usuarios[]>( URL );
  }
  private getExactus(usuario:string){
    const URL = this.getIRPURL( environment.getusuariosSoftland, `${usuario}` );
    return this.http.get<UsuariosSoftland[]>( URL );
  }

  syncGetExactusToPromise(usuario:string){

    return this.getExactus(usuario).toPromise()
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
      header: 'SD1 Móvil',
      subHeader,
      message,
      mode: 'ios',
      buttons: ['OK']
    });

    await alert.present();
  }
}
