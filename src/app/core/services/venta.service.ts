import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/Models/ClienteRequest';
import { paginado } from 'src/app/Models/paginado';
import { Productos } from 'src/app/Models/Productos';
import { environment } from 'src/environment/environment'; 

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  
  readonly ventaUrl = environment.apiUrl;

  getProductos(): HttpResourceRef<paginado<Productos> | undefined> {
    return httpResource<paginado<Productos>>(() => 
      `${this.ventaUrl}/producto?pagina=0&tamano=15&ordenar=nombre`
    );
  }

  getProductosNombre(busqueda: string): HttpResourceRef<paginado<Productos> | undefined> {
    if (!busqueda || busqueda.trim() === '') {
      return this.getProductos();
    }
    
    return httpResource<paginado<Productos>>(() => 
      `${this.ventaUrl}/producto/lista?busqueda=${encodeURIComponent(busqueda)}`
    );
  }
}
