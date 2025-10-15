import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'permisos', loadComponent: () => import('./components/permiso-list/permiso-list.component').then(m => m.PermisoListComponent) },
  { path: 'roles',    loadComponent: () => import('./components/roles-list/roles-list.component').then(m => m.RolesListComponent) },
  { path: 'roles/nuevo', loadComponent: () => import('./components/roles-form/roles-form.component').then(m => m.RolesFormComponent) },
  { path: 'roles/:id/editar', loadComponent: () => import('./components/roles-form/roles-form.component').then(m => m.RolesFormComponent) },
  { path: '', redirectTo: 'permisos', pathMatch: 'full' },
  { path: '**', redirectTo: 'permisos' }
];