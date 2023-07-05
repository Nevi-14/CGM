import { Injectable } from '@angular/core';
import { anticiposLineasView } from '../models/anticiposLineasView';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GastoConAnticipo } from '../models/gastoConAnticipo';

@Injectable({
  providedIn: 'root'
})
export class LineasAnticiposService {
  vistaAnticipos:anticiposLineasView[]=[]
  vistaAnticipo:anticiposLineasView = {
     id : null,
     iD_LINEA:null,
     fechA_INICIAL : null,
     fechA_FINAL: null,
     numerO_TRANSACCION: null,
     coD_COMPANIA:null,
     usuario :null,
     compania: null,
     moneda:null,
     monto: null,
     utilizado: null,
     restante: null,
     excedentes :null,
     estatus:null

  }
  
  constructor(
    public http: HttpClient
  ) { }


  private getIRPURL(api: string, id: string) {
    let test: string = '';

    if (!environment.prdMode) {
      test = environment.TestURL;
    }
    const URL = environment.preURL + test + environment.postURL + api + id;
    console.log(URL);
    return URL;
  }
  private getAnticipoLineaGastos(anticipo:number){
    let URL = this.getIRPURL(environment.getGastosConAnticipo,'');
    URL = URL+ anticipo;
        console.log('URL', URL)
    return this.http.get<GastoConAnticipo[]>(URL);

  }


syncGetAnticipoLineaGastosToPromise(anticipo){
  return this.getAnticipoLineaGastos(anticipo).toPromise();

}

  
}
