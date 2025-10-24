import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { ProductosComponent } from './productosComponent/productosComponent';
import { AuthGuard } from './core/Guards/auth.guard';
import { NgModule } from '@angular/core';
import { Principal } from './principal/principal';
import { ClientesComponent } from './clientes/clientes.component';
import { AuthCallbackComponent } from './auth-callback-component/auth-callback-component';
import { ProductosDetailsComponent } from './productosdetails.component/productosdetails.component';
import { CategoriasComponent } from './categoria.component/categoria.component';
import { ComprasComponent } from './compras.component/compras.component';
//import { RolesListComponent } from './roleslist-component/roleslist-component';
//import { PermisoListComponent } from './permisoscomponent/permisoscomponent';
//import { RolesFormComponentç } from './rolesformcomponent/rolesformcomponent';


export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'auth-callback', component: AuthCallbackComponent }, 
    { path: 'principal', component: Principal, canActivate: [AuthGuard]},
    { path: 'cliente', component:ClientesComponent, canActivate:[AuthGuard]},
    { path: 'compras', component: ComprasComponent, canActivate: [AuthGuard]},
    { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard]},
    { path: 'productos', component: ProductosDetailsComponent, canActivate: [AuthGuard]},
    { path: 'rol', loadComponent:()=> import('./roleslist-component/roleslist-component').then(m=>m.RolesListComponent), canActivate: [AuthGuard]},
    { path: 'permisos', loadComponent:()=> import('./permisoscomponent/permisoscomponent').then(m=>m.PermisoListComponent), canActivate: [AuthGuard]},
    { path: 'roles/nuevo', loadComponent: () => import('./rolesformcomponent/rolesformcomponent').then(m => m.RolesFormComponent) },
    { path: 'roles/:id/editar', loadComponent: () => import('./rolesformcomponent/rolesformcomponent').then(m => m.RolesFormComponent) },
    { path: 'ventas', component: Principal, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'principal' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }