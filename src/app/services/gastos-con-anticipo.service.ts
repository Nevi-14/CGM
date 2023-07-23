import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GastoConAnticipo } from '../models/gastoConAnticipo';
interface gastos {
  id:number,
  imagen:string,
  tipo : string,
  descripcion:string,
  total:number,
  gastos:GastoConAnticipo[]
}
@Injectable({
  providedIn: 'root'
})
export class GastosConAnticipoService {
  gastos:    gastos[] = [];
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

 

 
  private getUsuarioGastosConAnticipoEstado(anticipo:number, estado:string){
    let URL = this.getIRPURL(environment.getGastosConAnticipoEstado,'');
    URL = URL+anticipo+'&estado='+estado;
        console.log('URL', URL)
    return this.http.get<GastoConAnticipo[]>(URL);

  }

  private getUsuarioGastosConAnticiporeferencia(referencia:string){
    let URL = this.getIRPURL(environment.getGastosConAnticipoReferencia,'');
    URL = URL+referencia
        console.log('URL', URL)
    return this.http.get<GastoConAnticipo[]>(URL);

  }

  postGastoConAnticipo( lineasGasto: GastoConAnticipo[] ){
    console.log('lineasGasto', lineasGasto)
    const URL = this.getIRPURL( environment.postGastosConAnticipos, `` );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(lineasGasto));
    return this.http.post( URL, JSON.stringify(lineasGasto), options );
  }
  putGastoConAnticipo( lineasGasto: GastoConAnticipo ){
    let URL = this.getIRPURL( environment.putGastosConAnticipos, `` );
         URL = URL + lineasGasto.id;
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(lineasGasto));
    return this.http.put( URL, JSON.stringify(lineasGasto), options );
  }
  private deleteGastoConAnticipo(id:number){
    let URL = this.getIRPURL(environment.deleteGastosConAnticipos,'');
        URL = URL + id;
        const options = {
          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
    return this.http.delete(URL,options);
  }
  
 
  getUsuarioGastosConAnticipoEstadoToPromise(anticipo:number, estado:string){
    return this.getUsuarioGastosConAnticipoEstado(anticipo, estado).toPromise();
   }
  syncPostGastoConAnticipoToPromise(lineasGasto:GastoConAnticipo[]){
    return this.postGastoConAnticipo(lineasGasto).toPromise();
  }
syncPutGastoConAnticipoToPromise(lineasGasto:GastoConAnticipo){
  return this.putGastoConAnticipo(lineasGasto).toPromise();
}

syncGetUsuarioGastosConAnticiporeferenciaToPromise(referencia:string){
  return this.getUsuarioGastosConAnticiporeferencia(referencia).toPromise();
}

  syncDeleteGastoConAnticipoToPromise(id:number){

    return this.deleteGastoConAnticipo(id).toPromise();
  }


}
