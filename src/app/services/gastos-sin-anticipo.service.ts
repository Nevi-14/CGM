import { Injectable } from '@angular/core';
import { GastoSinAnticipo } from '../models/gastoSinAnticipo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class GastosSinAnticipoService {
  gastos: GastoSinAnticipo[] = [];
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
  private getGastosSinAnticipo(id: string , estado: string, value1: string, value2: string) {
    let URL = this.getIRPURL(environment.getGastosSinAnticipoURL, '');
    URL = URL +id + '&estado=' + estado+`&valor1=${value1}`+`&valor2=${value2}`;
    console.log('URL', URL)
    return this.http.get<GastoSinAnticipo[]>(URL);

  }
  private getGastosSinAnticipoTipo(id: string , tipo: number, identificador: string) {
    let URL = this.getIRPURL(environment. getGastosSinAnticipoTipo, '');
    URL = URL +id + '&tipo=' + tipo+`&identificador=${identificador}`;
    console.log('URL', URL)
    return this.http.get<GastoSinAnticipo[]>(URL);

  }
 
  private deleteGastoSinAnticipo(id:number){
    let URL = this.getIRPURL(environment.deleteGastosSinAnticipos,'');
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
syncGetGastosSinAnticipoToPromise(id: string , estado: string, value1: string, value2: string){

  return this.getGastosSinAnticipo(id,estado,value1,value2).toPromise();
}

syncGetGastosSinAnticipoTipoToPromise(id: string , tipo: number, identificador: string){

  return this.getGastosSinAnticipoTipo(id,tipo,identificador).toPromise();
}
  postGastoSinAnticipo(gastoSinAnticipo: GastoSinAnticipo[]) {
    const URL = this.getIRPURL(environment.postGastosSinAnticipos, ``);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      } 
    };
    console.log(JSON.stringify(gastoSinAnticipo));
    return this.http.post(URL, JSON.stringify(gastoSinAnticipo), options);
  }
  putGastoConAnticipo(gastoSinAnticipo: GastoSinAnticipo) {
    let URL = this.getIRPURL(environment.putGastosSinAnticipos, ``);
    URL = URL + gastoSinAnticipo.id;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(gastoSinAnticipo));
    return this.http.put(URL, JSON.stringify(gastoSinAnticipo), options);
  }

  syncPostGastoSinAnticipoToPromise(gastoSinAnticipo: GastoSinAnticipo[]) {
    return this.postGastoSinAnticipo(gastoSinAnticipo).toPromise();
  }
  syncPutGastoSinAnticipoToPromise(gastoSinAnticipo: GastoSinAnticipo) {
    return this.putGastoConAnticipo(gastoSinAnticipo).toPromise();
  }

 

  async sincronizarGastosSinAnticipos(usuario:string, valor1:string, valor2:string) {
   return this.syncGetGastosSinAnticipoToPromise(usuario,'',valor1,valor2);
   
  }

  syncDeleteGastoSinAnticipoToPromise(id:number){

    return this.deleteGastoSinAnticipo(id).toPromise();
  }
}
