import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoriaResponseDTO {
  idCategoria: number;
  nombre: string;
  activo: boolean;
}

export interface CategoriaRequestDTO {
  idCategoria?: number;
  nombre: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = 'http://localhost:8080/api/categoria'; // URL base

  constructor(private http: HttpClient) {}

  /**
   * GET /api/categoria
   * Lista todas las categorías
   */
  listarCategorias(): Observable<CategoriaResponseDTO[]> {
    return this.http.get<CategoriaResponseDTO[]>(this.apiUrl);
  }

  /**
   * POST /api/categoria/guardar
   * Crea una nueva categoría
   */
  guardarCategoria(request: CategoriaRequestDTO): Observable<CategoriaResponseDTO> {
    return this.http.post<CategoriaResponseDTO>(`${this.apiUrl}/guardar`, request);
  }

  /**
   * PATCH /api/categoria/actualizar
   * Actualiza una categoría existente
   */
  actualizarCategoria(request: CategoriaRequestDTO): Observable<CategoriaResponseDTO> {
    return this.http.patch<CategoriaResponseDTO>(`${this.apiUrl}/actualizar`, request);
  }

  /**
   * PATCH /api/categoria/{id}
   * Desactiva o cambia el estado de una categoría
   */
  cambiarEstado(id: number): Observable<CategoriaResponseDTO> {
    return this.http.patch<CategoriaResponseDTO>(`${this.apiUrl}/${id}`, null);
  }

  /**
   * GET /api/categoria/{id}
   */
  obtenerPorId(id: number): Observable<CategoriaResponseDTO> {
    return this.http.get<CategoriaResponseDTO>(`${this.apiUrl}/${id}`);
  }
}