import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrdenesDeCompraService } from 'src/app/services/ordenes-de-compra.service';
interface modules {
  title: string,
  subtitle: string,
  img: string,
  action: number
}
@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {
  year = new Date().getFullYear();
  modulos: modules[] = [
    {
      title: `Ordenes de compra`,
      subtitle: 'Ordenes de compra',
      img: 'assets/icon/oc.png',
      action: 1

    },
    {
      title: `Gestion Vacaciones`,
      subtitle: 'Gestion Vacaciones',
      img: 'assets/icon/vacaciones.png',
      action: 2
    },
    {
      title: `Liquidación Viáticos`,
      subtitle: 'Liquidación Viáticos',
      img: 'assets/icon/viaticos.png',
      action: 3

    },
    {
      title: `Talento Humano`,
      subtitle: 'Talento Humano',
      img: 'assets/icon/RH.png',
      action: 4

    }
  ]
  constructor(
    public modalCtrl: ModalController,
    public ordenesDeCompraService: OrdenesDeCompraService
  ) { }

  ngOnInit() {
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
