import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Devoluciones } from '../models/devoluciones';
 
@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {

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
    
     
      private getDevolucionReferenciaUsuario(id:string, referencia:string){
        let URL = this.getIRPURL(environment.getUsuarioDevolucion,'');
        URL = URL+id+`&referencia=${referencia}`;
            console.log('URL', URL)
        return this.http.get<Devoluciones[]>(URL);
    
      }
      private getDevolucionUsuario(id:string){
        let URL = this.getIRPURL(environment.getUsuarioDevoluciones,id);
            console.log('URL', URL)
        return this.http.get<Devoluciones[]>(URL);
    
      }
     
      private getDevolucionUsuarioRangoFecha(id:string,valor1:string,valor2:string, id_anticipo:string){
        let URL = this.getIRPURL(environment.getUsuarioDevolucion,'');
        URL = URL+id + `&valor1=${valor1}`+ `&valor2=${valor2}`+ `&id_anticipo=${id_anticipo}`
            console.log('URL', URL)
        return this.http.get<Devoluciones[]>(URL);
    
      }
    
    
      postDevolucion( devolucion: Devoluciones){
        const URL = this.getIRPURL( environment.postDevolucion, `` );
        const options = {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
          }
        };
        console.log(JSON.stringify(devolucion));
        return this.http.post( URL, JSON.stringify(devolucion), options );
      }
      putDevolucion( devolucion: Devoluciones ){
        let URL = this.getIRPURL( environment.putDevolucion, `` );
             URL = URL + devolucion.id;
        const options = {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
          }
        };
        console.log(JSON.stringify(devolucion));
        return this.http.put( URL, JSON.stringify(devolucion), options );
      }
      private deleteDevolucion(id:number){
        let URL = this.getIRPURL(environment.deleteDevolucion,'');
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
 
      syncGetDevolucionUsuarioToPromise(id:string){
        return this.getDevolucionUsuario(id).toPromise();
      }
      syncGetDevolucionReferenciaUsuarioToPromise(id:string, referencia:string){
        return this.getDevolucionReferenciaUsuario(id,referencia).toPromise();
      }
      syncGetDevolucionUsuarioRangoFechaToPromise(id:string,valor1:string,valor2:string, id_anticipo:string){
       return this.getDevolucionUsuarioRangoFecha(id,valor1,valor2, id_anticipo).toPromise();
      }
      syncPostSDevolucionToPromise( devolucion: Devoluciones ){
        return this.postDevolucion( devolucion ).toPromise();
      }
      syncPutDevolucionToPromise( devolucion: Devoluciones ){
        return this.putDevolucion( devolucion ).toPromise();
      }
      syncDeleteDevolucion(id:number){
        return this.deleteDevolucion(id).toPromise();
      }

}
