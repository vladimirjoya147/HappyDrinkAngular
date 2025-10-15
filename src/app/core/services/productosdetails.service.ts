import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface ProductoResponseDTO {
  idProducto: number;
  codigoBarra: string;
  nombre: string;
  descripcion: string;
  idCategoria: number;
  categoria: any;
  idProveedorPreferido: number;
  proveedorPreferido: any;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  path: string;
}

export interface ProductoRequestDTO {
  idProducto?: number;
  codigoBarra: string;
  nombre: string;
  descripcion: string;
  idCategoria: number;
  idProveedorPreferido: number;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  activo: boolean;
  path?: string;
}

export interface PageResponse<T> {
  contenido: T[];
  totalPaginas: number;
  totalElementos: number;
  numeroPagina: number;
  tamanioPagina: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:8080/api/producto';

  constructor(private http: HttpClient) {}

  listarProductos(pagina: number = 0, tamano: number = 10, ordenar: string = 'nombre'):
    Observable<PageResponse<ProductoResponseDTO>> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamano', tamano.toString())
      .set('ordenar', ordenar);
    return this.http.get<PageResponse<ProductoResponseDTO>>(this.apiUrl, { params });
  }

  buscarPorNombreOCodigo(busqueda: string, pagina: number = 0, tamano: number = 10):
    Observable<PageResponse<ProductoResponseDTO>> {
    const params = new HttpParams()
      .set('busqueda', busqueda)
      .set('pagina', pagina.toString())
      .set('tamano', tamano.toString());
    return this.http.get<PageResponse<ProductoResponseDTO>>(`${this.apiUrl}/lista`, { params });
  }

  guardarProducto(request: ProductoRequestDTO): Observable<ProductoResponseDTO> {
    return this.http.post<ProductoResponseDTO>(`${this.apiUrl}/guardar`, request);
  }

  actualizarProducto(request: ProductoRequestDTO): Observable<ProductoResponseDTO> {
    return this.http.patch<ProductoResponseDTO>(`${this.apiUrl}/actualizar`, request);
  }

  cambiarEstado(id: number, activo: boolean): Observable<ProductoResponseDTO> {
    const params = new HttpParams().set('activo', activo.toString());
    return this.http.patch<ProductoResponseDTO>(`${this.apiUrl}/${id}/estado`, null, { params });
  }

  buscarPorCodigo(codigo: string): Observable<ProductoResponseDTO> {
    const params = new HttpParams().set('codigo', codigo);
    return this.http.get<ProductoResponseDTO>(`${this.apiUrl}/buscar`, { params });
  }
}