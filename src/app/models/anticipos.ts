export class  Anticipos{
    constructor(
    public id : number,
    public correoEnviado : boolean,
    public estado: string,
    public remitente: string,
    public destinatario:string,
    public codCompania :string,
    public compania: string,
    public fechaInicial: Date,
    public fechaFinal: Date,
    public fechaCorte: Date,
    public detalle :string,
    public fechaTransaccion: Date,
    public numeroTransaccion :string,
    public moneda:string,
    public monto: number,
    public utilizado: number,
    public restante: number,
    public exedente: number
     
    ){}
}