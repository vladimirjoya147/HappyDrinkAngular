import { Component, inject } from '@angular/core';
import { VentaService } from '../core/services/venta.service';

@Component({
  selector: 'app-productos',
  imports: [],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos {
  readonly productoService = inject(VentaService);
  protected readonly productoResource = this.productoService.getProductos();
}
