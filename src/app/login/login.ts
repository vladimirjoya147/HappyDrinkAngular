import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/Models/LoginRequest';
import { AuthService } from '../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form: LoginRequest = { username: '', password: '' };
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.error = null;
    this.authService.login(this.form).subscribe({
      next: () => {
        this.router.navigate(['/productos']);
      },
      error: () => {
        this.error = 'Credenciales inválidas';
      }
    });
  }
}
