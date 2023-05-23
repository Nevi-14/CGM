import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OC, OCAprobBD, OCLineasBD } from '../models/definiciones';

@Injectable({
  providedIn: 'root'
})
export class OrdenesDeCompraService {
  ocLineas: OCLineasBD[] = []
  ocPendientes: OC[] = [];
  cantidadOCs = 0;
  constructor(
public http: HttpClient

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


  getOCAprobLineas(usuario: string){
    const URL = this.getIRPURL( environment.OCAprobURL, `?usuario=${usuario}` );
    return this.http.get<OCLineasBD[]>( URL );
  }

  getOCTransLineas(usuario: string){
    const URL = this.getIRPURL( environment.OCTransURL, `?usuario=${usuario}` );
    return this.http.get<OCLineasBD[]>( URL );
  }

  putOCAprob( ocAprob: OCAprobBD ){
    const URL = this.getIRPURL( environment.OCApURL, `?ID=${ocAprob.ORDEN_COMPRA}&usuario=${ocAprob.Usuario}` );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(ocAprob));
    return this.http.put( URL, JSON.stringify(ocAprob), options );
  }

}
