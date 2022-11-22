import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OC, OCAprobBD, OCLineasBD, TiposGastos, Usuarios } from '../models/definiciones';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BdService {

  ocLineas: OCLineasBD[] = [];
  ocPendientes: OC[] = [];
  cantidadOCs = 0;

  constructor( private http: HttpClient ) { }

  private getIRPURL( api: string, id: string ){
    let test: string = '';

    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preIRPURL + test + environment.postURL + api + id;
    console.log(URL);
    return URL;
  }

  private getISAURL( api: string, id: string ){
    let test: string = '';

    if ( !environment .prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preISAURL + test + environment.postURL + api + id;
    console.log(URL);
    return URL;
  }

  getAut(usuario: string, clave: string){
    const URL = this.getIRPURL( environment.usuariosURL, `?usuario=${usuario}&clave=${clave}` );
    return this.http.get<Usuarios[]>( URL );
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

  getTiposGastos(){
    const URL = this.getIRPURL( environment.TipGastosURL, `` );
    return this.http.get<TiposGastos[]>( URL );
  }

}
