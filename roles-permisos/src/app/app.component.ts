import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container my-4" style="width:80%;">
      <h2>{{ title() }}</h2>
      <nav class="mb-3">
        <a routerLink="/permisos" routerLinkActive="active" class="btn btn-outline-primary btn-sm me-2">Permisos</a>
        <a routerLink="/roles"    routerLinkActive="active" class="btn btn-outline-secondary btn-sm">Roles</a>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.css']
})

export class AppComponent{
  title = signal('Administración');
}



