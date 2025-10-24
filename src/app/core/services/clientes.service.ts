import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../Models/Cliente';
import { PageResponse } from 'src/app/Models/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = 'http://localhost:8080/api/cliente';

  constructor(private http: HttpClient) { }

  // Listar clientes activos
  getClientes(pagina: number = 0, tamanio: number = 10, nombre: string = 'nombreCliente'): Observable<PageResponse<Cliente>> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('tamanio', tamanio)
      .set('nombre', nombre);
    return this.http.get<PageResponse<Cliente>>(this.apiUrl, { params });
  }

  // Buscar clientes por nombre o documento
  buscarClientes(busqueda: string, pagina: number = 0, tamanio: number = 10, nombre: string = 'nombreCliente'): Observable<PageResponse<Cliente>> {
    const params = new HttpParams()
      .set('busqueda', busqueda)
      .set('pagina', pagina)
      .set('tamanio', tamanio)
      .set('nombre', nombre);
    return this.http.get<PageResponse<Cliente>>(`${this.apiUrl}/listar`, { params });
  }

  // Buscar cliente por ID
  getClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // Guardar nuevo cliente
  guardarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/guardar`, cliente);
  }

  // 5. Actualizar cliente
  actualizarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.apiUrl}/actualizar`, cliente);
  }

  // 6. Activar o desactivar cliente
  activarDesactivarCliente(id: number, activo: boolean): Observable<Cliente> {
    const params = new HttpParams().set('activo', activo);
    return this.http.patch<Cliente>(`${this.apiUrl}/${id}`, {}, { params });
  }
}
