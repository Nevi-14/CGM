import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesServiceService {
  menu:boolean = false;
  segment:string = 'gastos';
  constructor() { }
}
