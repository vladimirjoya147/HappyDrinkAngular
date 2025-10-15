import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
}

interface DecodedToken {
  sub: string;
  user_id: number;
  email: string;
  roles: string[];
  nombre_completo?: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authServerUrl = 'http://localhost:9000';
  private clientId = 'angular-client';
  private redirectUri = 'http://localhost:4200/auth-callback';
  private tokenEndpoint = `${this.authServerUrl}/oauth2/token`;
  private authorizeEndpoint = `${this.authServerUrl}/oauth2/authorize`;

  constructor(private http: HttpClient) {}

  async redirectToAuthServer(): Promise<void> {
  const state = crypto.randomUUID();
  const codeVerifier = this.generateCodeVerifier();
  const codeChallenge = await this.generateCodeChallenge(codeVerifier);

  localStorage.setItem('pkce_verifier', codeVerifier);
  localStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: this.clientId,
    redirect_uri: this.redirectUri,
    scope: 'openid profile email',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  window.location.href = `${this.authorizeEndpoint}?${params.toString()}`;
}


  exchangeCodeForToken(code: string): Observable<any> {
  const codeVerifier = localStorage.getItem('pkce_verifier') || '';
  const clientSecret = 'angular-secret'; 

  const body = new HttpParams()
    .set('grant_type', 'authorization_code')
    .set('code', code)
    .set('redirect_uri', this.redirectUri)
    .set('client_id', this.clientId)
    .set('client_secret', clientSecret)
    .set('code_verifier', codeVerifier);

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  return this.http.post(this.tokenEndpoint, body.toString(), { headers }).pipe(
    tap((tokens: any) => {
      console.log("acces_token: "+ tokens.access_token)
      console.log("refresh _token: "+tokens.refresh_token)
      console.log("id_token"+tokens.id_token)
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      localStorage.setItem('id_token', tokens.id_token); 
    })
  );
}

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.authServerUrl}/login`, body).pipe(
      tap((tokens: any) => {
        localStorage.setItem('access_token', tokens.access_token);
      })
    );
  }

  logout() {
  const accessToken = this.getAccessToken();
  
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('pkce_verifier');
  localStorage.removeItem('oauth_state');


  const idToken = localStorage.getItem('id_token');
  
  if (idToken) {
  
    const logoutUrl = `${this.authServerUrl}/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent('http://localhost:4200/login')}`;
    window.location.href = logoutUrl;
  } else if (accessToken) {
    const logoutUrl = `${this.authServerUrl}/logout?post_logout_redirect_uri=${encodeURIComponent('http://localhost:4200/login')}`;
    window.location.href = logoutUrl;
  } else {

    window.location.href = 'http://localhost:4200/login';
  }
}

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return base64Digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  getUserId(): number | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.user_id || null;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  getNombreCompleto(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.nombre_completo || decoded.sub || null;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}
