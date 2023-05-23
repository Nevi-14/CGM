import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EditarGastoPage } from '../editar-gasto/editar-gasto.page';
import { GastoConAnticipo } from 'src/app/models/gastoConAnticipo';
import { ControlGastosService } from 'src/app/services/control-gastos.service';
import { EditarGastoSinAnticipoPage } from '../editar-gasto-sin-anticipo/editar-gasto-sin-anticipo.page';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
interface gastos {
  id: number,
  imagen: string,
  tipo: string,
  descripcion: string,
  total: number,
  gastos: any[] 
}
@Component({
  selector: 'app-mostrar-gastos',
  templateUrl: './mostrar-gastos.page.html',
  styleUrls: ['./mostrar-gastos.page.scss'],
})
export class MostrarGastosPage implements OnInit {
  @Input() tipo:gastos
  gastos:any[]=[]
  total:number = 0;
  url = "https://sde1.sderp.site/api-coris-control-viaticos/api/descargar-archivo?id=";
  constructor(
public modalCtrl:ModalController,
public alertasService: AlertasService,
public usuariosService:UsuariosService,
public anticiposService:AnticiposService,
public controlGastosService:ControlGastosService,
public gastosSinAnticipoService:GastosSinAnticipoService


  ) { }

  ngOnInit() {
 console.log(this.tipo)
if(this.anticiposService.vistaAnticipo){
  this.anticiposService.syncgetUsuarioGastosAnticipoTipo(this.usuariosService.usuario.usuario,this.anticiposService.vistaAnticipo.iD_LINEA,this.tipo.id).then(gastos =>{
    this.gastos = gastos;
    gastos.forEach(gasto =>{
      this.total += gasto.monto;
    })
   })
}else{
  this.controlGastosService.fechaInicioS.setHours(0, 0, 0, 0)
  this.controlGastosService.fechaFinS.setHours(0, 0, 0, 0)
  let identificador = this.controlGastosService.fechaInicioSemana.split('T')[0]+this.controlGastosService.fechaFinSemana.split('T')[0];
  this.gastosSinAnticipoService.syncGetGastosSinAnticipoTipoToPromise(this.usuariosService.usuario.usuario,this.tipo.id, identificador).then(gastos =>{
    this.gastos = gastos;
    gastos.forEach(gasto =>{
      this.total += gasto.monto;
    })
   })
}
   }
  regresar(){
this.modalCtrl.dismiss();

  }

  async editarGasto(nuevoGasto:GastoConAnticipo){
    if(nuevoGasto.estatus == 'A'){
      return this.alertasService.message('SD1 Móvil','Lo sentimos, no se pueden modificar gastos aprobados!..')
    }
    const modal = await this.modalCtrl.create({
      component: !this.controlGastosService.gastoSinAnticipo ? EditarGastoPage : EditarGastoSinAnticipoPage,
      mode:'ios',
      componentProps:{
        nuevoGasto
      }
    })
   modal.present();


   }
}
