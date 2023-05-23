import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
// npm i @ionic/storage-angular --save --dev
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage:Storage | null = null

  constructor(private storage:Storage) {

    this.init();


   }


   async init(){
    //if using defined drivers here :  await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage
   }

   async set( key:string, value:any){
   this._storage?.set(key,value);

   console.log('key saved', key)
   }

   async get( key:string){
  let value = await  this.storage.get(key);

  return value;
    }
    async delete( key:string){
      this._storage?.remove(key);
      }
}
