// services/venta-real.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment'; 
import { CarritoService, DetalleVenta } from './carrito.service';
import { AuthService } from './auth.service'; 

export interface VentaRequest {
  idCliente: number;
  idUsuario: number;
  totalVenta: number;
  metodoPago: string;
  detalles: {
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class VentaRealService {
  private readonly apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private carritoService = inject(CarritoService);
  private authService = inject(AuthService);

  registrarVenta(ventaRequest: VentaRequest) {
    return this.http.post(`${this.apiUrl}/venta`, ventaRequest);
  }

  crearVentaRequest(idCliente: number, metodoPago: string): VentaRequest {
    const carritoItems = this.carritoService.carritoItems();
    const idUsuario = this.authService.getUserId() ?? 0;
    return {
      idCliente: idCliente,
      idUsuario: idUsuario,
      totalVenta: this.carritoService.total(),
      metodoPago: metodoPago,
      detalles: carritoItems.map(item => ({
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        descuento: item.descuento
      }))
    };
  }
}