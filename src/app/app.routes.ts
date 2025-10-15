import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { ProductosComponent } from './productosComponent/productosComponent';
import { AuthGuard } from './core/Guards/auth.guard';
import { NgModule } from '@angular/core';
import { Principal } from './principal/principal';
import { ClientesComponent } from './clientes/clientes.component';


export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'auth-callback', component: AuthCallbackComponent }, 
    { path: 'principal', component: Principal, canActivate: [AuthGuard]},
    { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard]},
    { path: 'productos', component: ProductosDetailsComponent, canActivate: [AuthGuard]},
    { path: 'ventas', component: Principal, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'principal', pathMatch: 'full' },
    { path: '**', redirectTo: 'principal' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }