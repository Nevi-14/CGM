export class Notificaciones {
    constructor(
      
      public id : number,
      public canalNotificacion:string,
      public tipoNotificacion:string,
      public anticipo:boolean,
      public estatus: boolean,
      public usuario : string,
      public fecha: Date,
      public titulo:string,
      public referencia:string,
      public descripcion:string,
      public requiereAdjunto: boolean,
      public adjunto:string
    ){}
  }