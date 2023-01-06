import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicio-sesion',
    pathMatch: 'full'
  },
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./pages/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule)
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
    path: 'viaticos',
    loadChildren: () => import('./pages/viaticos/viaticos.module').then( m => m.ViaticosPageModule)
  },
  {
    path: 'nuevo-gasto',
    loadChildren: () => import('./pages/nuevo-gasto/nuevo-gasto.module').then( m => m.NuevoGastoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
