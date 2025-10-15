import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProveedorResponseDTO {
  idProveedor: number;
  nombreProveedor: string;
  ruc: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
}

export interface ProveedorRequestDTO {
  idProveedor?: number;
  nombreProveedor: string;
  ruc: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = 'http://localhost:8080/api/proveedor';

  constructor(private http: HttpClient) {}

  listarProveedores(): Observable<ProveedorResponseDTO[]> {
    return this.http.get<ProveedorResponseDTO[]>(this.apiUrl);
  }

  buscarProveedores(busqueda: string): Observable<ProveedorResponseDTO[]> {
    const params = new HttpParams().set('busqueda', busqueda);
    return this.http.get<ProveedorResponseDTO[]>(`${this.apiUrl}/buscar`, { params });
  }

  guardarProveedor(request: ProveedorRequestDTO): Observable<ProveedorResponseDTO> {
    return this.http.post<ProveedorResponseDTO>(`${this.apiUrl}/guardar`, request);
  }

  actualizarProveedor(request: ProveedorRequestDTO): Observable<ProveedorResponseDTO> {
    return this.http.patch<ProveedorResponseDTO>(`${this.apiUrl}/actualizar`, request);
  }

  cambiarEstado(id: number, activo: boolean): Observable<ProveedorResponseDTO> {
    const params = new HttpParams().set('activo', activo.toString());
    return this.http.put<ProveedorResponseDTO>(`${this.apiUrl}/${id}/estado`, null, { params });
  }
  buscarPorId(id: number): Observable<ProveedorResponseDTO> {
  return this.http.get<ProveedorResponseDTO>(`${this.apiUrl}/${id}`);
}

}