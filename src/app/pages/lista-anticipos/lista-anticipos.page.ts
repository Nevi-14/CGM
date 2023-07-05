import { Component, OnInit } from '@angular/core';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { AlertasService } from '../../services/alertas.service';
import { ModalController } from '@ionic/angular';
import { anticiposLineasView } from 'src/app/models/anticiposLineasView';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';

@Component({
  selector: 'app-lista-anticipos',
  templateUrl: './lista-anticipos.page.html',
  styleUrls: ['./lista-anticipos.page.scss'],
})
export class ListaAnticiposPage implements OnInit {
  today:Date = new Date();
  y = this.today.getFullYear();
  m = this.today.getMonth();
  value1 = new Date(this.y, this.m , 1).toISOString();
  value2 = new Date(this.y, this.m+1 , 0).toISOString();
  constructor(
    public alertasService: AlertasService,
    public anticiposService: AnticiposService,
    public usuariosService:UsuariosService,
    public modalCtrl:ModalController,
    public controlGastosService:ControlGastosService
  ) { }

  ngOnInit() {
this.alertasService.presentaLoading('Cargando datos...')
    this.anticiposService.syncGetUsuarioAnticiposRngoFecha(this.usuariosService.usuario.usuario,new Date().toISOString()).then(anticipos =>{
      this.alertasService.loadingDissmiss();
      this.anticiposService.vistaAnticipos = anticipos;
      console.log('anticipos',anticipos)
       
      
        }, error =>{
          this.alertasService.loadingDissmiss();
          this.alertasService.message('SD1 Móvil','Lo sentimos algo salio mal..')
        })


  }


  async retornarAnticipo(anticipo:anticiposLineasView){
    await this.controlGastosService.limpiarDatos();
    await this.controlGastosService.destruirDashboard();
    let anticipos = await this.anticiposService.syncGetUsuarioAnticipoBYId(anticipo.id);
    await  this.controlGastosService.sincronizarGastos();
    this.modalCtrl.dismiss({
      anticipo:anticipos[0],
      vistaAnticipo:anticipo
    })

  }
}
