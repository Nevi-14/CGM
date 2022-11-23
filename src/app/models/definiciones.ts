
export interface Usuarios {
  empleado: string;
  usuario:  string;
  clave:    string;
  email:    string;
  nombre:   string;
  rol:      string;
  fecha:    Date;
}

export interface OCLineasBD {
  ordeN_COMPRA: string;
  usuario: string;
  estatus: string;
  fecha: Date;
  usuarioOC: string;
  tipO_ORDEN: string;
  departamento: string;
  desc_Tipo_Orden: string;
  condicioN_PAGO: string;
  moneda: string;
  pais: string;
  fechaOC: Date;
  fechA_REQUERIDA: Date;
  fechA_COTIZACION: Date;
  porC_DESCUENTO: number;
  montO_DESCUENTO: number;
  totaL_MERCADERIA: number;
  totaL_IMPUESTO1: number;
  montO_FLETE: number;
  montO_SEGURO: number;
  montO_ANTICIPO: number;
  totaL_A_COMPRAR: number;
  articulo: string;
  ordeN_COMPRA_LINEA: number;
  descripcion: string;
  cantidaD_ORDENADA: number;
  preciO_UNITARIO: number;
  impuestO1: number;
  porcDescuentoLinea: number;
  descuento: number;
}

export interface OCLineasBD2 {
  ORDEN_COMPRA:   string;
  Usuario:        string;
  Estatus:        string;
  Fecha:          string;
  UsuarioOC:      string;
  PROVEEDOR:      string;
  NOMBRE:         string;
  BODEGA:         string;
  CONDICION_PAGO: string;
  MONEDA:         string;
  PAIS:           string;
  FechaOC:        Date;
  FECHA_REQUERIDA:  Date;
  FECHA_COTIZACION: Date;
  PORC_DESCUENTO:   number;
  MONTO_DESCUENTO:  number;
  TOTAL_MERCADERIA: number;
  TOTAL_IMPUESTO1:  number;
  MONTO_FLETE:      number;
  MONTO_SEGURO:     number;
  MONTO_DOCUMENTACIO: number;
  MONTO_ANTICIPO:   number;
  TOTAL_A_COMPRAR:  number;
  ARTICULO:         string;
  DESCRIPCION:      string;
  CANTIDAD_ORDENADA:  number;
  PRECIO_UNITARIO:    number;
  IMPUESTO1:          number;
  PorcDescuentoLinea: number;
  Descuento:          number;
  ORDEN_COMPRA_LINEA: number;
}

export class OC {
  constructor(
    public ORDEN_COMPRA:   string,
    public Usuario:        string,
    public Estatus:        string,
    public Fecha:          Date,
    public UsuarioOC:      string,
    public PROVEEDOR:      string,
    public NOMBRE:         string,
    public BODEGA:         string,
    public CONDICION_PAGO: string,
    public MONEDA:         string,
    public PAIS:           string,
    public FechaOC:        Date,
    public FECHA_REQUERIDA:  Date,
    public FECHA_COTIZACION: Date,
    public PORC_DESCUENTO:   number,
    public MONTO_DESCUENTO:  number,
    public TOTAL_MERCADERIA: number,
    public TOTAL_IMPUESTO1:  number,
    public MONTO_FLETE:      number,
    public MONTO_SEGURO:     number,
    public MONTO_DOCUMENTACIO: number,
    public MONTO_ANTICIPO:   number,
    public TOTAL_A_COMPRAR:  number,
    public lineas:           OCLineas[] = []
  ){}
}

export class OCLineas {
  constructor(
    public ARTICULO:           string,
    public DESCRIPCION:        string,
    public CANTIDAD_ORDENADA:  number,
    public PRECIO_UNITARIO:    number,
    public IMPUESTO1:          number,
    public PorcDescuentoLinea: number,
    public Descuento:          number,
    public ORDEN_COMPRA_LINEA: number,
  ){}
}

export interface OCAprobBD {
  ORDEN_COMPRA: string;
  Usuario:      string;
  Estatus:      string;
  Fecha:        Date;
}

/********************************************** Control de Viáticos ****************************************/

export class Viaticos {
  constructor(
    public TIPO_GASTO:    string,
    public DESCRIPCION:   string,
    public CUENTA:        string,
    public MONTO:         number,
    public USUARIO:       string,
    public lineas:        ViLineas[] = []
  ){}
}

export class ViLineas {
  constructor(
    public LINEA:         string,
    public DESCRIPCION:   string,
    public FECHA:         Date,
    public MONTO:         number,
    public PROVEEDOR:     string,
    public NOMBRE:        string,
    public FACTURA:       string,
  ){}
}

export interface TiposGastos {
  tipoGasto: string;
  descripcion: string;
  cuenta: string;
}

export class LineaGasto {
  constructor(
    public fecha: Date,
    public usuario: string,
    public referencia: string,
    public ceCo: string,
    public cuenta: string,
    public tipo_Gasto: string,
    public descripcion: string,
    public monto: number,
    public rol: string,
    public procesado: string,
  ){}
}

