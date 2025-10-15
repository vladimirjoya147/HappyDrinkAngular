import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback-component.html',
  imports:[CommonModule],
  styleUrls: ['./auth-callback-component.css']
})
export class AuthCallbackComponent implements OnInit {
  loading = true;
  message = 'Procesando inicio de sesión...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];

      if (!code) {
        this.loading = false;
        this.message = 'No se recibió el código de autorización.';
        return;
      }

      this.authService.exchangeCodeForToken(code).subscribe({
        next: () => {
          this.message = 'Inicio de sesión exitoso. Redirigiendo...';
          setTimeout(() => this.router.navigate(['/principal']), 1000); 
        },
        error: err => {
          console.error('Error al intercambiar el código:', err);
          this.loading = false;
          this.message = 'Error al procesar el inicio de sesión.';
        }
      });

    });
  }
}
