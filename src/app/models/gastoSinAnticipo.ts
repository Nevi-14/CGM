export class GastoSinAnticipo {
    constructor(
      public id:number,
      public iD_TIPO_GASTO: number,
      public modificadO_POR: string,
      public fecha: Date,
      public fechA_INICIAL: Date,
      public fechA_FINAL: Date,
      public identificador:string,
      public cuentA_COSTOS: string,
      public moneda: string,
      public tarjeta:boolean,
      public usuario: string,
      public referencia: string,
      public proveedor: string,
      public justificacion: string,
      public descripcion: string,
      public adjunto: string,
      public monto: number,
      public estatus:string,
      public observaciones: string
    ){}
  }