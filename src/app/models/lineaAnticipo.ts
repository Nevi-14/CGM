export class LineaAnticipo {
    constructor(
      
      public id : number,
      public iD_ANTICIPO: number,
      public correO_ENVIADO : number,
      public estatus: string,
      public usuario:string,
      public monto: number,
      public utilizado: number,
      public restante: number
    ){}
  }