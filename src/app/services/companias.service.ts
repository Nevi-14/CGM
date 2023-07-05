import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Companias } from '../models/companias';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaniasService {
  companias:Companias[]=[];
  constructor(
    public http:HttpClient

  ) { }

getAPI(api:string){

  let test = "";
  if(!environment.prdMode) test = environment.TestURL;
  const URL = environment.preURL + test + environment.postURL + api;
  return URL;
}

private getCompanias(){
const URL = this.getAPI(environment.getCompanias);
console.log('URL',URL)
return this.http.get<Companias[]>(URL);
}

syncGetCompaniasToPromise(){
  return this.getCompanias().toPromise();
}

}
