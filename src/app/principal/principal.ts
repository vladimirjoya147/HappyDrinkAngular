import { Component } from '@angular/core';
import { ProductosComponent } from '../productosComponent/productosComponent'; 
import { Ventas } from '../ventas/ventas';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar.component/navbar.component'; 

@Component({
  selector: 'app-principal',
  imports: [ProductosComponent, Ventas,NavbarComponent],
  templateUrl: './principal.html',
  styleUrl: './principal.css'
})
export class Principal {
  constructor(
      private authService: AuthService,
      private router: Router
    ) {}

  logout(): void {
    this.authService.logout();        
    this.router.navigate(['/login']); 
  }
}
