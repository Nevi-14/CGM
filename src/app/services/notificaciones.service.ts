import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Notificaciones } from '../models/notificaciones';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
notificaciones:Notificaciones[]=[]
  constructor(
  public http:HttpClient  
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
  private getNotificacionesUsuario(id: string, estado:string) {
    let URL = this.getIRPURL(environment.getNotificacionesUsuario, id);
        URL = URL + `&estatus=${estado}`
    console.log('URL', URL)
    return this.http.get<Notificaciones[]>(URL);

  }

  putNotificacion(notificacion: Notificaciones) {
    let URL = this.getIRPURL(environment.putNotificacion, ``);
    URL = URL + notificacion.id;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(notificacion));
    return this.http.put(URL, JSON.stringify(notificacion), options);
  }

syncGetNotificacionesUsuarioToPromise(id:string, estado:string){

  return this.getNotificacionesUsuario(id, estado).toPromise();
}

syncPutNotificacionToPromise(notificacion: Notificaciones){
  return this.putNotificacion(notificacion).toPromise();
}
}
