import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-formulario-liquidacion',
  templateUrl: './formulario-liquidacion.page.html',
  styleUrls: ['./formulario-liquidacion.page.scss'],
})
export class FormularioLiquidacionPage implements OnInit {

  constructor(
 public modalCtrl:ModalController   
  ) { }

  ngOnInit() {
  }
  regresar(){
this.modalCtrl.dismiss();
  }
}
