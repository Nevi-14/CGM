import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Sobrantes } from '../models/sobrantes';

@Injectable({
  providedIn: 'root'
})
export class SobrantesService {

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
    
     
      private getSobranteAnticipoUsuario(id:string, referencia:string){
        let URL = this.getIRPURL(environment.getUsuarioSobrante,'');
        URL = URL+id+`&referencia=${referencia}`;
            console.log('URL', URL)
        return this.http.get<Sobrantes[]>(URL);
    
      }
      private getSobranteUsuario(id:string){
        let URL = this.getIRPURL(environment.getUsuarioSobrante,id);
            console.log('URL', URL)
        return this.http.get<Sobrantes[]>(URL);
    
      }
     
      private getSobranteUsuarioRangoFecha(id:string,valor1:string,valor2:string, id_anticipo:string){
        let URL = this.getIRPURL(environment.getUsuarioSobrante,'');
        URL = URL+id + `&valor1=${valor1}`+ `&valor2=${valor2}`+ `&id_anticipo=${id_anticipo}`
            console.log('URL', URL)
        return this.http.get<Sobrantes[]>(URL);
    
      }
    
    
      postSobrante( sobrante: Sobrantes){
        const URL = this.getIRPURL( environment.postSobrante, `` );
        const options = {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
          }
        };
        console.log(JSON.stringify(sobrante));
        return this.http.post( URL, JSON.stringify(sobrante), options );
      }
      putSobrante( sobrante: Sobrantes ){
        let URL = this.getIRPURL( environment.putSobrante, `` );
             URL = URL + sobrante.id;
        const options = {
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
          }
        };
        console.log(JSON.stringify(sobrante));
        return this.http.put( URL, JSON.stringify(sobrante), options );
      }
      private deleteSobrante(id:number){
        let URL = this.getIRPURL(environment.deleteSobrante,'');
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
 
      syncGetSobranteUsuarioToPromise(id:string){
        return this.getSobranteUsuario(id).toPromise();
      }
      syncGetSobranteAnticipoUsuarioToPromise(id:string, referencia:string){
        return this.getSobranteAnticipoUsuario(id,referencia).toPromise();
      }
      syncGetSobranteUsuarioRangoFechaToPromise(id:string,valor1:string,valor2:string, id_anticipo:string){
       return this.getSobranteUsuarioRangoFecha(id,valor1,valor2, id_anticipo).toPromise();
      }
      syncPostSobranteToPromise( sobrante: Sobrantes ){
        return this.postSobrante( sobrante ).toPromise();
      }
      syncPutSobranteToPromise( sobrante: Sobrantes ){
        return this.putSobrante( sobrante ).toPromise();
      }
      syncDeleteSobrante(id:number){
        return this.deleteSobrante(id).toPromise();
      }

}
