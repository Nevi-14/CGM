import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/camera/ngx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ComponentModule } from './components/component.module';
//  npm install @ionic-native/camera --save --dev
// npm i @ionic/storage-angular
// set font to PDF
PdfMakeWrapper.setFonts(pdfFonts);
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicModule.forRoot({
    scrollPadding:true,
    scrollAssist:false

  }),IonicStorageModule.forRoot(), ComponentModule],
  providers: [ Camera, {provide: RouteReuseStrategy, useClass: IonicRouteStrategy },FileOpener],
  bootstrap: [AppComponent],
})
export class AppModule {}
