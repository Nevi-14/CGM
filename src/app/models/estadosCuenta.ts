export class  EstadosCuenta {
    constructor(
    public id : number,
    public anticipo: boolean,
    public referencia : string,
    public usuario: string,
    public fecha:string,
    public fechA_INICIAL: string,
    public fechA_FINAL: string,
    public monto: number,
    public restante:number,
    public utilizado:number,
    public observaciones:string
     
    ){}
}