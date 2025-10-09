import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from 'src/app/Models/LoginRequest';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from 'src/app/Models/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login';
  private tokenKey = 'accessToken';
  private refreshKey = 'refreshToken';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, request).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.accessToken);
        localStorage.setItem(this.refreshKey, res.refreshToken);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; 
      return Date.now() < exp;
    } catch (e) {
      console.error('Error decoding token:', e);
      return false;
    }
  }

  
  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles || [];
    } catch {
      return [];
    }
  }

  getUserId(): number | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || null; 
  } catch (e) {
    console.error('Error al extraer el ID del token:', e);
    return null;
  }
}
}
