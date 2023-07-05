export class  anticiposLineasView {
    constructor(
    public id : number,
    public iD_LINEA: number,
    public fechA_INICIAL : Date,
    public fechA_FINAL: Date,
    public numerO_TRANSACCION: string,
    public coD_COMPANIA:string,
    public usuario :string,
    public compania: string,
    public moneda: string,
    public monto: number,
    public utilizado: number,
    public restante: number,
    public excedentes :number,
    public estatus:string
     
    ){}
}