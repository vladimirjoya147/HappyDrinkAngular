import { inject, Injectable } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { paginado } from 'src/app/Models/paginado';
import { Cliente } from 'src/app/Models/ClienteRequest';
import { environment } from 'src/environment/environment'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);
  private readonly clienteUrl = `${environment.apiUrl}/cliente`;

  getClientes(busqueda: string): Observable<paginado<Cliente>> {
    const url = `${this.clienteUrl}?pagina=0&tamanio=3&busqueda=${encodeURIComponent(busqueda)}`;
    return this.http.get<paginado<Cliente>>(url);
  }
}