import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { anticiposLineasView } from '../models/anticiposLineasView';
import { UsuariosService } from './usuarios.service';
import { Anticipos } from '../models/anticipos';
import { LineaAnticipo } from '../models/lineaAnticipo';
import { GastoConAnticipo } from '../models/gastoConAnticipo';
import { GastosConAnticipoService } from './gastos-con-anticipo.service';
import { VistaAnticipoLineasAnticipo } from '../models/vistaAnticipoLineasAnticipo';


@Injectable({
  providedIn: 'root'
})
export class AnticiposService {
  anticipos: Anticipos[] = [];
  vistaAnticipos: anticiposLineasView[] = [];
  anticipo: Anticipos = null;
  vistaAnticipo: anticiposLineasView = null;
  gastos: GastoConAnticipo[] = [];

  constructor(
    public http: HttpClient,
    public usuariosService: UsuariosService,
    public gastosConAnticipoService: GastosConAnticipoService
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
  putAnticipo(anticipo: Anticipos) {
    let URL = this.getIRPURL(environment.putAnticipoAPI, ``);
    URL = URL + anticipo.id;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(anticipo));
    return this.http.put(URL, JSON.stringify(anticipo), options);
  }
  putAnticipoLinea(anticipo: LineaAnticipo) {
    let URL = this.getIRPURL(environment.putLineaAnticipo, ``);
    URL = URL + anticipo.id;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(URL));
    console.log(JSON.stringify(anticipo));
    return this.http.put(URL, JSON.stringify(anticipo), options);
  }
  getUsuarioAnticipoID(id: number) {
    const URL = this.getIRPURL(environment.getAnticipo, `${id}`);
    return this.http.get<Anticipos[]>(URL);
  }

  getUsuarioLineaAnticipoID(id: number) {
    const URL = this.getIRPURL(environment.getLineanticipo, `${id}`);
    return this.http.get<LineaAnticipo[]>(URL);
  }
  getVistaAnticipoLineasAnticipo(id:string,referencia:string) {
    let URL = this.getIRPURL(environment.getVistaAnticipoLineasAnticipo, `${id}`);
    URL = URL + `&referencia=${referencia}`
    console.log(URL, 'URL')
    return this.http.get<VistaAnticipoLineasAnticipo[]>(URL);
  }
  getUsuarioAnticiposRangoFecha(usuario: string, valor1: string) {
    const URL = this.getIRPURL(environment.getVistaUsuarioLineaAnticipo, `${usuario}`);
    return this.http.get<anticiposLineasView[]>(URL);
  }

  getvistaAnticipoReferencia(referencia) {
    let URL = this.getIRPURL(environment.getVistaAnticipoReferencia, ``);
        URL = URL + referencia;
    return this.http.get<anticiposLineasView[]>(URL);
  }

   
  getUsuarioGastosAnticipoTipo(usuario: string, anticipo: number, tipo: number) {
    const URL = this.getIRPURL(environment.getGastosConAnticipoTipo, `${anticipo}&tipo=${tipo}`);
    return this.http.get<GastoConAnticipo[]>(URL);
  }

  private getUsuarioAnticipoGastosConAticipo(anticipo: number) {
    let URL = this.getIRPURL(environment.getGastosConAnticipo, '');
    URL = URL + anticipo;
    console.log('URL', URL)
    return this.http.get<GastoConAnticipo[]>(URL);

  }


  getgastosAnticipoRangoFechaToPromise(anticipo) {
    return this.getUsuarioAnticipoGastosConAticipo(anticipo).toPromise();

  }

  syncGetVistaAnticipoLineas(id:string,referencia:string){
    return this.getVistaAnticipoLineasAnticipo(id,referencia).toPromise()
  }
  syncGetUsuarioAnticipoBYId(id: number) {
    return this.getUsuarioAnticipoID(id).toPromise();
  }
  syncGetLineaUsuarioAnticipoBYId(id: number) {
    return this.getUsuarioLineaAnticipoID(id).toPromise();
  }
  syncgetUsuarioGastosAnticipoTipo(usuario: string, anticipo: number, tipo: number) {
    return this.getUsuarioGastosAnticipoTipo(usuario, anticipo, tipo).toPromise();
  }
  syncPutAnticipoToPromise(anticipo: Anticipos) {
    return this.putAnticipo(anticipo).toPromise();
  }
  syncPutLineaAnticipoToPromise(anticipo: LineaAnticipo) {
    return this.putAnticipoLinea(anticipo).toPromise();
  }
  syncGetUsuarioAnticiposRngoFecha(usuario: string, valor1: string) {
    return this.getUsuarioAnticiposRangoFecha(usuario, valor1).toPromise();
  }

syncGetVistaAnticipoReferenciaToPromise(referencia){
  return this.getvistaAnticipoReferencia(referencia).toPromise();
}
}
