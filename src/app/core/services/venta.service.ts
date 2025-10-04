import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { paginado } from 'src/app/Models/paginado';
import { Productos } from 'src/app/Models/Productos';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  readonly ventaUrl = 'http://localhost:8080/api';

  getProductos() : HttpResourceRef<paginado | undefined>{
    return httpResource<paginado>(()=> `${this.ventaUrl}/producto?pagina=0&tamano=15&ordenar=nombre`)
  }


}
