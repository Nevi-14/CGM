export const environment = {
  production:   true,
  adminClave:   '@dmin2021*',
  preURL: 'https://sde1.sderp.site/',
  TestURL: '_test',
  preURL2:'https://api_isa',
  postURL: 'api-coris-control-viaticos/api/',
  OCApURL:      'ONE_OCAprob/',
  OCAprobURL:   'ONE_OCAprobQuery/',
  OCTransURL:   'ONE_OCTransQuery/',
  TipGastosURL: 'get/tipos/gastos',
  usuariosURL:  'ONE_Aut/',
  clientesURL:  'ClientesRut/',
  // SOFTLAND
  getusuariosSoftland:'get/usuario/exactus?id=',
  // CORREO
  postCorreo:'post/enviar/correo',
  // ANTICIPOS
  getAnticipo:'get/anticipo?id=',
  getVistaAnticipoLineasAnticipo:'get/vista/anticipo/linea/anticipo?id=',
  putAnticipoAPI: 'put/anticipo?id=',

  // LINEA ANTICIPOS
  getLineaAnticipo:'get/linea/anticipo?id=',
  getVistaUsuarioLineaAnticipo:'get/vista/usuario/linea/anticipo?id=',
  getLineanticipo:'get/linea/anticipo?id=',
  putLineaAnticipo:'put/linea/anticipo?id=',
  // GASTOS CON ANTICIPO
  getGastosConAnticipo:'get/gastos/linea/anticipo?id=',
  getGastosConAnticipoTipo:'get/gastos/linea/anticipo/tipo?id=',
  getGastosConAnticipoEstado:'get/gastos/linea/anticipo/estado/?id=',
  postGastosConAnticipos:'post/gasto/linea/anticipo',
  putGastosConAnticipos:'put/gasto/linea/anticipo?id=',
  deleteGastosConAnticipos:'delete/gasto/linea/anticipo?id=',
  // GASTOS SIN ANTICIPO
  getGastosSinAnticipoURL:'get/usuario/gastos/sin/anticipo/estado/rango/fecha?id=',
  postGastosSinAnticipos:'post/gasto/sin/anticipo',
  putGastosSinAnticipos:'put/gasto/sin/anticipo?id=',
  deleteGastosSinAnticipos:'delete/gasto/sin/anticipo?id=',
  getGastosSinAnticipoTipo:'get/gastos/sin/anticipo/tipo?id=',

  // SOBRANTES
getUsuarioSobrante:'get/sobrante/usuario?id=',
postSobrante:'post/sobrante',
putSobrante:'put/sobrante?id=',
deleteSobrante:'delete/sobrante?id=',

// ESTADOS CUENTA
getUsuarioEstadosCuenta:'get/usuario/estados/cuenta?id=',
// COMPANIAS
getCompanias:'get/companias',
// notificaciones

getNotificacionesUsuario:'get/notificaciones/usuario?id=',
putNotificacion:'put/notificacion?id=',

  // DEVOLUCIONES
  getUsuarioDevolucion:'get/devolucion/usuario?id=',
  getUsuarioDevoluciones:'get/devoluciones/usuario?id=',
  postDevolucion:'post/devolucion',
  putDevolucion:'put/devolucion?id=',
  deleteDevolucion:'delete/devolucion?id=',
  prdMode:true,
};
