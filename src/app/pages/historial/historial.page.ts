import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FiltroHistorialPage } from '../filtro-historial/filtro-historial.page';
import { ModalController } from '@ionic/angular';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { TiposGastosService } from 'src/app/services/tipos-gastos.service';
import { AnticiposService } from 'src/app/services/anticipos.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
gastos = []
vistaAnticipo:any = null;
totalColones = 0;
totalDolares = 0;
  constructor(
public modalCtrl:ModalController,
public controlGastosService:ControlGastosService,
public cd:ChangeDetectorRef,
public tiposGastosService:TiposGastosService,
public anticiposService:AnticiposService

  ) { }

  async ngOnInit() {
    if(this.tiposGastosService.tiposGastos.length == 0){
      this.tiposGastosService.tiposGastos = await this.tiposGastosService.getTiposGastos().toPromise();
    }
  }
    imagenT(gastos:any){


    console.log(gastos, 'gastos',this.tiposGastosService.tiposGastos,'this.tiposGastosService.tiposGastos')
    let i = this.tiposGastosService.tiposGastos.findIndex(e => e.id == gastos.iD_TIPO_GASTO);
    if(i >=0){
      return this.tiposGastosService.tiposGastos[i].imagen
    }
  }

  async filtroHistorial() {
    const modal = await this.modalCtrl.create({
      component: FiltroHistorialPage,
      mode: 'ios',
      initialBreakpoint: 0.45,
      breakpoints: [0, 0.25, 0.5, 0.75]
    })

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != undefined) {
      console.log('data',data)
      this.vistaAnticipo = data.vistaAnticipo;
    this.gastos = data.gastos;
    this.cd.detectChanges();
    }
  }
  limpiarGastos(){
    this.totalColones = 0;
    this.totalDolares = 0;
    this.vistaAnticipo = null;
    this.gastos = [];
  }
}
