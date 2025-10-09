import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { ProductosComponent } from './productosComponent/productosComponent';
import { AuthGuard } from './core/Guards/auth.guard';
import { NgModule } from '@angular/core';
import { Principal } from './principal/principal';

import { ClientesComponent } from './clientes/clientes.component';

export const routes: Routes = [
    { path: 'login', component: Login},
    { path: 'principal', component: Principal, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}