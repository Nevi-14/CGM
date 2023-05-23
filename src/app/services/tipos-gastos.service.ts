import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TiposGastos } from '../models/tiposGastos';
import { TiposGastosPage } from '../pages/tipos-gastos/tipos-gastos.page';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TiposGastosService {
  tiposGastos:TiposGastos[]=[]
  tipo:TiposGastos;
  constructor(
public http: HttpClient,
public modalctrl:ModalController

  ) { }

  private getIRPURL( api: string, id: string ){
    let test: string = '';

    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preURL + test + environment.postURL + api + id;
    console.log(URL);
    return URL;
  }

  getTiposGastos(){
    const URL = this.getIRPURL( environment.TipGastosURL, `` );
    return this.http.get<TiposGastos[]>( URL );
  }

  async tiposGastosModal() {

    let modal = await this.modalctrl.create({
      component: TiposGastosPage,
      componentProps: {
      editar:true
      },
      mode: 'ios',
      initialBreakpoint: 0.55,
      breakpoints: [0, 0.25, 0.5, 0.75],
 
    })

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
 
     
    }

  }
}
