import { Component, inject } from '@angular/core';
import { VentaService } from '../core/services/venta.service';

@Component({
  selector: 'app-consumo',
  imports: [],
  templateUrl: './consumo.html',
  styleUrl: './consumo.css'

})
export class Consumo {
  readonly productoService = inject(VentaService);
  protected readonly productoResource = this.productoService.getProductos();
}
