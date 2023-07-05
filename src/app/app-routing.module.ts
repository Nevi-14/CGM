import { NgModule } from '@angular/core';
import { PreloadAllModules, Route, RouterModule, Routes, UrlSegment, CanLoad } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicio-sesion',
    pathMatch: 'full'
  },
  {
    path: 'calendario-popover',
    loadChildren: () => import('./pages/calendario-popover/calendario-popover.module').then( m => m.CalendarioPopoverPageModule)
  },
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./pages/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule),
    canLoad:[IntroGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'ordenes-compra',
    loadChildren: () => import('./pages/ordenes-compra/ordenes-compra.module').then( m => m.OrdenesCompraPageModule)
  },
  {
    path: 'oc-detalles',
    loadChildren: () => import('./pages/oc-detalles/oc-detalles.module').then( m => m.OcDetallesPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'mostrar-gastos',
    loadChildren: () => import('./pages/mostrar-gastos/mostrar-gastos.module').then( m => m.MostrarGastosPageModule)
  },
  
  {
    path: 'lista-anticipos',
    loadChildren: () => import('./pages/lista-anticipos/lista-anticipos.module').then( m => m.ListaAnticiposPageModule)
  },
  {
    path: 'informacion',
    loadChildren: () => import('./pages/informacion/informacion.module').then( m => m.InformacionPageModule)
  },
  {
    path: 'nuevo-gasto-anticipo',
    loadChildren: () => import('./pages/nuevo-gasto-anticipo/nuevo-gasto-anticipo.module').then( m => m.NuevoGastoAnticipoPageModule)
  },
  {
    path: 'nuevo-gasto-sin-anticipo',
    loadChildren: () => import('./pages/nuevo-gasto-sin-anticipo/nuevo-gasto-sin-anticipo.module').then( m => m.NuevoGastoSinAnticipoPageModule)
  },
  {
    path: 'tipos-gastos',
    loadChildren: () => import('./pages/tipos-gastos/tipos-gastos.module').then( m => m.TiposGastosPageModule)
  },
  {
    path: 'editar-gasto',
    loadChildren: () => import('./pages/editar-gasto/editar-gasto.module').then( m => m.EditarGastoPageModule)
  },
  {
    path: 'estados-cuenta',
    loadChildren: () => import('./pages/estados-cuenta/estados-cuenta.module').then( m => m.EstadosCuentaPageModule)
  },
 
  {
    path: 'editar-gasto-sin-anticipo',
    loadChildren: () => import('./pages/editar-gasto-sin-anticipo/editar-gasto-sin-anticipo.module').then( m => m.EditarGastoSinAnticipoPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'mi-perfil',
    loadChildren: () => import('./pages/mi-perfil/mi-perfil.module').then( m => m.MiPerfilPageModule)
  },
 
  {
    path: 'liquidaciones',
    loadChildren: () => import('./pages/liquidaciones/liquidaciones.module').then( m => m.LiquidacionesPageModule)
  },
  {
    path: 'formulario-liquidacion',
    loadChildren: () => import('./pages/formulario-liquidacion/formulario-liquidacion.module').then( m => m.FormularioLiquidacionPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./pages/notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
  },
  {
    path: 'detalle-notificaciones',
    loadChildren: () => import('./pages/detalle-notificaciones/detalle-notificaciones.module').then( m => m.DetalleNotificacionesPageModule)
  },
 
  {
    path: 'filtro-historial',
    loadChildren: () => import('./pages/filtro-historial/filtro-historial.module').then( m => m.FiltroHistorialPageModule)
  },  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },

 
   






 



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
