import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BdService } from 'src/app/services/bd.service';
import { D1Service } from 'src/app/services/d1.service';

@Component({
  selector: 'app-nuevo-gasto',
  templateUrl: './nuevo-gasto.page.html',
  styleUrls: ['./nuevo-gasto.page.scss'],
})
export class NuevoGastoPage implements OnInit {

  constructor( private d1: D1Service,
               private bd: BdService,
               private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  regresar(){
    this.modalCtrl.dismiss();
  }

}
