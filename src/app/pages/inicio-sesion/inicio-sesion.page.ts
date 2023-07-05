import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertasService } from '../../services/alertas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Correo } from 'src/app/models/correo';
import { EmailService } from 'src/app/services/email.service';
import { ControlGastosService } from 'src/app/services/control-gastos.service';

interface login{
  usuario: string,
  password: string
}

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {
  showPass = false;
  lock     = false;
  loginUser: login;
  verificarCuenta:boolean = false;
  codigoSeguridad = null;
  constructor(
               private usuariosService:UsuariosService,
               private modalCtrl: ModalController,
               private router: Router,
               private alertasService: AlertasService,
               public emailService:EmailService,
               public controlGastosService:ControlGastosService,
               public cd:ChangeDetectorRef
                ) { }

  ngOnInit() {
    this.loginUser = {
      usuario: '',
      password: ''
    }
  }
 
  login(fLogin: NgForm){

    this.loginUser.usuario =  fLogin.value.usuario;
    this.loginUser.password =  fLogin.value.password;
    if (fLogin.valid){
      this.usuariosService.presentaLoading('Espere...');
      this.usuariosService.syncGetExactusToPromise(this.loginUser.usuario).then(
       async (resp) => {
          this.usuariosService.loadingDissmiss();
          if (resp.length > 0){
            if(!this.verificarCuenta ){
              this.verificarCuenta = true;
           this.enviarCodigoSeguridad(fLogin)
                     

            }else{
          if(this.codigoSeguridad == this.loginUser.password){
         //   await this.controlGastosService.limpiarDatosIniciales();
         this.usuariosService.usuario = resp[0];
         this.usuariosService.guardarUsuario();
            this.router.navigateByUrl('/inicio', {replaceUrl:true});
  
          }else{
            this.usuariosService.presentAlert('SD1 Móvil', 'Código de seguridad incorrecto!..');
          }
            }
           

          } else {
            this.codigoSeguridad = null;
            this.verificarCuenta = false;
            this.usuariosService.presentAlert('SD1 Móvil', 'Lo sentimos, contacta al administrador!..');
          this.cd.detectChanges();
          }
        }, error => {
          this.usuariosService.loadingDissmiss();
          this.usuariosService.presentAlert('SD1 Móvil', 'Lo sentimos, algo salio mal!..');
        }
      )
   
    }
  }

 async enviarCodigoSeguridad(fLogin: NgForm){
 
    this.loginUser.usuario =  fLogin.value.usuario;
    this.alertasService.message('SD1 Móvil','Se ha enviado un código de seguridad a su correo!.')
    this.codigoSeguridad =  this.generarCodigoSeguridad(4)
     this.usuariosService.syncGetExactusToPromise(this.loginUser.usuario).then( async (resp) =>{
if(resp.length == 0){
  this.codigoSeguridad = null;
  this.verificarCuenta = false;
  this.usuariosService.presentAlert('SD1 Móvil', 'Lo sentimos, contacta al administrador!..');
this.cd.detectChanges();
  return
}
      let email:Correo = {
        toEmail:resp[0].correO_ELECTRONICO,
        file:null,
        subject:'Código verificación',
        body:`Código verificación inicio de sesión <strong>${this.codigoSeguridad }</strong> Por favor no compartir el  código de verificación con nadie, si usted no solicito este código de verificación por favor cominicarse con el adminisrrador.`
      }
             await this.emailService.syncPostEmailToPromise(email)
    }, error =>{
      this.codigoSeguridad = null;
      this.verificarCuenta = false;
      this.usuariosService.presentAlert('SD1 Móvil', 'Lo sentimos algo salio mal!..');

    })

            
  }
  generarCodigoSeguridad(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
 
 

}
