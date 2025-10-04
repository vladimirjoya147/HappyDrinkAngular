import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Productos } from './productos/productos';
import { AuthGuard } from './core/Guards/auth.guard';
import { NgModule } from '@angular/core';


export const routes: Routes = [
    { path: 'login', component: Login},
    { path:'productos', component: Productos, canActivate: [AuthGuard]},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}