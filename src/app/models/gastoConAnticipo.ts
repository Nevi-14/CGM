export class GastoConAnticipo {
    constructor(
      public id:number,
      public iD_LINEA_ANTICIPO:number,
      public fecha: Date,
      public tarjeta:boolean,
      public usuario: string,
      public referencia: string,
      public iD_TIPO_GASTO: number,
      public proveedor: string,
      public justificacion: string,
      public descripcion: string,
      public observaciones: string,
      public adjunto: string,
      public monto: number,
      public porcentajeiva: number,
      public montoiva: number,
      public estatus:string
    ){}
  }