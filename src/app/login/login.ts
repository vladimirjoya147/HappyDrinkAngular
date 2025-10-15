import { Component, signal } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports:[CommonModule],
  styleUrls: ['./login.css']
})
export class Login {
  username = signal('');
  password = signal('');
  error = signal<string | null>(null);

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Si llega con código de autorización desde el Auth Server
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.authService.exchangeCodeForToken(code).subscribe({
          next: () => this.router.navigate(['/principal']),
          error: err => this.error.set('Error al obtener el token')
        });
      }
    });
  }

  loginWithAuthServer() {
    this.authService.redirectToAuthServer();
  }

  onLogin() {
    this.authService.login(this.username(), this.password()).subscribe({
      next: () => this.router.navigate(['/principal']),
      error: () => this.error.set('Credenciales inválidas')
    });
  }

  logout(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
}

}
