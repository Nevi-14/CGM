import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EstadosCuenta } from '../models/estadosCuenta';

@Injectable({
  providedIn: 'root'
})
export class EstadoCuentaService {
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
    
     
    
     
      private getUsuarioEstadosCuenta(id:string){
        let URL = this.getIRPURL(environment.getUsuarioEstadosCuenta,id);
            console.log('URL', URL)
        return this.http.get<EstadosCuenta[]>(URL);
    
      }
    
    
      syncGetUsuarioEstadosCuentaToPromise(id:string){

        return this.getUsuarioEstadosCuenta(id).toPromise();
      }
   
    
}
