import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage-service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
@ViewChild(IonSlides) slides:IonSlides; 
  constructor(
   private storageService:StorageService,
   public router: Router 
  ) { }

  ngOnInit() {
  }

  next(){

    this.slides.slideNext();
  }

  async start(){
    this.storageService.set('has-seen','true').then(resp =>{

      this.router.navigateByUrl('/inicio-sesion',{replaceUrl:true});

    })
  




  }

}
