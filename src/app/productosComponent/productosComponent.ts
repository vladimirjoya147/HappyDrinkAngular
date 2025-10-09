import { Component, inject,signal,Injector  } from '@angular/core';
import { VentaService } from '../core/services/venta.service';
import { ClienteService } from '../core/services/cliente.service';
import { Cliente } from '../Models/ClienteRequest';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../core/services/carrito.service';
import { Productos } from '../Models/Productos';
import { HttpResourceRef } from '@angular/common/http';
import { paginado } from '../Models/paginado';


@Component({
  selector: 'app-productos',
  imports: [FormsModule],
  templateUrl: './productosComponent.html',
  styleUrl: './productosComponent.css'
})
export class ProductosComponent {

  readonly clienteService = inject(ClienteService);
  readonly carritoService = inject(CarritoService);
  private injector = inject(Injector);
  private ventaService = inject(VentaService);
  busquedaCliente: string = ''


  searchTerm = signal<string>('');
  
  isSearchMode = signal<boolean>(false);
  
  productoResource: HttpResourceRef<paginado<Productos> | undefined>;
  
  productoSearchResource: HttpResourceRef<paginado<Productos> | undefined> | null = null;

  constructor() {
    this.productoResource = this.ventaService.getProductos();
  }
  
  agregarProducto(producto: Productos) {
    this.carritoService.agregarProducto(producto);
  }
  buscarProductos(): void {
    const term = this.searchTerm().trim();
    
    if (term) {
      this.isSearchMode.set(true);
      
      import('@angular/core').then(({ runInInjectionContext }) => {
        runInInjectionContext(this.injector, () => {
          this.productoSearchResource = this.ventaService.getProductosNombre(term);
        });
      });
    }
  }

  volverAlListadoGeneral(): void {
    this.searchTerm.set('');
    this.isSearchMode.set(false);
    this.productoSearchResource = null;
    this.productoResource = this.ventaService.getProductos();
  }

  get productoResourceActivo(): HttpResourceRef<paginado<Productos> | undefined> {
    return this.isSearchMode() && this.productoSearchResource 
      ? this.productoSearchResource 
      : this.productoResource;
  }


  imprimirBoleta() {
      const contenido = document.getElementById('printArea')?.innerHTML;

      if (!contenido) {
        console.error('No se encontró el contenido de impresión.');
        return;
      }

    const ventana = window.open('', '', 'width=400,height=600');
    const estiloURL = 'assets/styles/boleta.css';

    ventana?.document.write(`
      <html>
        <head>
          <title>Boleta de Venta</title>
          <link rel="stylesheet" href="${estiloURL}">
        </head>
        <body onload="window.print(); window.close();">
          <div class="ticket">
            ${contenido}
          </div>
        </body>
      </html>
    `);

    ventana?.document.close();
  }
}

