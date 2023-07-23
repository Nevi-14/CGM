import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EstadosCuenta } from 'src/app/models/estadosCuenta';
import { AlertasService } from 'src/app/services/alertas.service';
import { AnticiposService } from 'src/app/services/anticipos.service';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { GastosConAnticipoService } from 'src/app/services/gastos-con-anticipo.service';
import { GastosSinAnticipoService } from 'src/app/services/gastos-sin-anticipo.service';
import { LineasAnticiposService } from 'src/app/services/lineas-anticipos.service';
import { PdfService } from 'src/app/services/pdf.service';
import { SobrantesService } from 'src/app/services/sobrantes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-estados-cuenta',
  templateUrl: './estados-cuenta.page.html',
  styleUrls: ['./estados-cuenta.page.scss'],
})
export class EstadosCuentaPage implements OnInit {
  estadosCuenta:EstadosCuenta[]=[];
  constructor(
public modalCtrl:ModalController,
public alertasService:AlertasService,
public estadosCuentaService:EstadoCuentaService,
public usuariosService: UsuariosService,
public anticiposService:AnticiposService,
public gastosConAnticipoService:GastosConAnticipoService,
public pdfService:PdfService,
public lineasAnticiposService:LineasAnticiposService,
public sobrantesService:SobrantesService,
public gastosSinAnticipoService:GastosSinAnticipoService

  ) { }

  ngOnInit() {
    this.alertasService.presentaLoading('Cargando datos..')
   this.estadosCuentaService.syncGetUsuarioEstadosCuentaToPromise(this.usuariosService.usuario.usuario).then(resp =>{
      this.alertasService.loadingDissmiss();
      this.estadosCuenta = resp;
    }, error =>{
      this.alertasService.loadingDissmiss();
    })

  }
  regresar(){
    this.modalCtrl.dismiss();
  }
 async descargarEstadoDeCuenta(estado:EstadosCuenta){
  this.alertasService.presentaLoading('Generando estado de cuenta...')
console.log(estado)
    if(estado.anticipo){
let vistaAnticipo  = await this.anticiposService.syncGetVistaAnticipoLineas(estado.usuario,estado.referencia);
console.log(vistaAnticipo)
let lineaAnticipo = await this.anticiposService.syncGetLineaUsuarioAnticipoBYId(vistaAnticipo[0].id)
let gastos = await this.gastosConAnticipoService.getUsuarioGastosConAnticipoEstadoToPromise(vistaAnticipo[0].id,""); 
let sobrantes = await this.sobrantesService.syncGetSobranteAnticipoUsuarioToPromise(estado.usuario, vistaAnticipo[0].numerO_TRANSACCION)
this.pdfService.generatePDF(estado,gastos)
this.alertasService.loadingDissmiss();

    }else{

        let gastos = await this.gastosSinAnticipoService.syncGetGastosSinAnticipoToPromise(estado.usuario,'F', estado.fechA_INICIAL.split('T')[0],estado.fechA_FINAL.split('T')[0])
        this.pdfService.generatePDF(estado,gastos)
        this.alertasService.loadingDissmiss();
        
          
    }

  }


}
