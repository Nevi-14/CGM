import { Injectable } from '@angular/core';
import { CanLoad, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage-service';
export const INTRO_KEY = 'has-seen';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {

  constructor(private router:Router, private storageService:StorageService){}


  async canLoad():Promise<boolean>  {

 
  return   this.storageService.get(INTRO_KEY).then(hasSeenIntro =>{
console.log('hasSeenIntro',hasSeenIntro)

      if(hasSeenIntro){
        return true;
      
      }else{
        this.router.navigateByUrl('/intro',{replaceUrl:true});
        return true;
        
      }

    });


  }
}
