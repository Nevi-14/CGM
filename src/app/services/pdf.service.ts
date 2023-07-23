import { Injectable } from '@angular/core';
import {PdfMakeWrapper} from 'pdfmake-wrapper';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';
import { ColonesPipe } from '../pipes/colones.pipe';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
import { EstadosCuenta } from '../models/estadosCuenta';
 // npm i pdfmake-wrapper --save --dev
 // npm i pdfmake --save --dev
 // npm i @ionic-native/file-opener --save --dev
 // npm i cordova-plugin-file-opener2 --save --dev
 // npm install @awesome-cordova-plugins/file-opener --save --dev
interface productsToAdd {
  id: number,
  total: number,
  units:number,
  subTotal: number,
  tax: number,
  taxPercentage: number,
  product: any

}


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(
public http: HttpClient,
public fileOpener:FileOpener,
public platform: Platform
  ) { }

  getFormattedDate(date) {


    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return day + '/' + month + '/' + year;
}


generatePDF( linea:EstadosCuenta, gastos:any[]){

  this.http.get('assets/coris.png', { responseType: 'blob' })
  .subscribe(res => {
    const reader = new FileReader();
    reader.onloadend = () => {
      var base64data = reader.result;                
          console.log(base64data);
 
         this.rellenarpdf(base64data, linea, gastos)
    }

    reader.readAsDataURL(res); 
    console.log(res);
  });

 
}


  async rellenarpdf(image,linea:EstadosCuenta, gastos:any[]){

 
    

    const pdf = new PdfMakeWrapper();
    pdf.pageMargins(20);

    pdf.info({
      title:'Estdo de cuenta',
      author: 'autor',
      subject: 'Estado Cuenta',
  });

    let data = [];


    let header = {
      layout: 'noBorders', // optional
      table: {
      headerRows: 1,
      widths: [ '*', 'auto', 100, '*' ],
      body: [
        [ { image: image,width: 100},
          [
          { text: 'Grupo Coris'},
          { text: 'Reporte Estado De  Cuenta'},
          { text: ''}

        ], '', this.getFormattedDate(new Date()) ],
        [{ text: '', margin: [ 10, 10, 10, 10 ]} , '' , '' , '', ],
        [   { text: 'Fecha Inicio Corte:', bold: true} , this.getFormattedDate(new Date()) , '' , '', ],
        [   { text: 'Fecha Fin Corte:', bold: true} , this.getFormattedDate(new Date()) , '' , '', ],
        [   { text: 'Usuario:', bold: true} , linea.usuario , '' , '' ],
        [   { text: 'Moneda', bold: true} ,'' +'' , '' , '' ],
        [   { text: 'Monto:', bold: true} ,ColonesPipe.prototype.transform(linea.monto, 2 , '.' , ',' , '') , '' , '' ],
        [   { text: 'Consumido:', bold: true} , ColonesPipe.prototype.transform(linea.utilizado, 2 , '.' , ',' , '') , '' , ''],
        [   { text:'Restante:', bold: true} , ColonesPipe.prototype.transform(linea.restante, 2 , '.' , ',' , '') , '' , '' ],

    
        [     { text: 'Desgloce Gastos',alignment: 'left',margin: [0, 10, 0, 10],bold: true}, '', '', '' ]
      ]
    }
    }

    let body = {
      layout: 'lightHorizontalLines', // optional
      table: {
      headerRows: 1,
      widths: ['*', 'auto', '*', '*','*'],
      body: [
        ['Factura','Fecha','Proveedor', 'Descripción', 'Monto']
      ]
    }
    }
    let montos = {
      layout: 'noBorders', // optional
      table: {
      headerRows: 1,
      widths: ['*', 'auto', '*', '*','*'],
      body: [
        ['','', '',   '',''],
        [{ text: 'Total Gastos: ', bold: true},'', '',   '',''],
        [{ text: ColonesPipe.prototype.transform(linea.utilizado, 2 , '.' , ',' , '')},'', '', '',  ''],
        [{ text: 'Sobrantes: ', bold: true},'', '', '',  ''],
        [{ text: ColonesPipe.prototype.transform(linea.restante, 2 , '.' , ',' , '')},'', '', '',  ''],
        
      ]
    }
    }




    for(let a =0; a < gastos.length ; a++){

      body.table.body.push([ gastos[a].referencia, this.getFormattedDate(new Date(gastos[a].fecha)), gastos[a].proveedor, gastos[a].descripcion,  ColonesPipe.prototype.transform(gastos[a].monto, 2 , '.' , ',' ,   '')])
      if( a == gastos.length -1){

  
        pdf.add(
          [
          header,
          body,
          montos
         
        ]
      
        );
   
        if(!this.platform.is('mobileweb')) {
          pdf.create().download('estado cuenta');
          pdf.create().getBase64( base64URL =>{

 
            console.log('base64URL', base64URL)
   
            return this.save(base64URL)
          })
          
        }else{
          pdf.create().download('estado cuenta');
        }
      //  pdf.create().download('estado cuenta');
 
      }
    }


    



  }
  async save(base64URL){
    let path = `pdf/reporte_${Date.now()}.pdf`;
     const saveFile = await Filesystem.writeFile({
       path,
       data:base64URL,
       directory:Directory.Documents,
       recursive:true
     
      })
 
      this.fileOpener.open(saveFile.uri,'application/pdf')
   }

}
