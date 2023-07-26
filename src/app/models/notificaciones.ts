export class Notificaciones {
    constructor(
      
      public id : number,
      public remitente:string,
      public canal:string, // correo, movil
      public tipo:string, // ECAGSA Estado de cuenta Aprobado,ECGSAR Estado Cuenta Rechazado, ECGSAPA Estado Cuenta Pendiente Aprobacion,  AA Anticipo Aprobado,AR Anticipo Rechazado, APA Anticipo Pendiente Aprobacion, GCA Gasto Con Anticipo Aprobado, GCR  Gasto con Anticipo Rechazado,GSA Gasto Sin Anticipo Aprobado, GSR Gasto Sin Anticipo Rechazado, SAP Sobrante Acciones Pendientes,     
      public estatus: string,
      public usuario : string,
      public fecha: Date,
      public fechaLimite: Date,
      public titulo:string,
      public referencia:string,
      public descripcion:string

    ){}
  }