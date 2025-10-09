// ventas.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { ClienteService } from '../core/services/cliente.service';
import { CarritoService } from '../core/services/carrito.service';
import { VentaRealService } from '../core/services/venta-real.service';
import { Cliente } from '../Models/ClienteRequest';
import { environment } from 'src/environment/environment'; 

@Component({
  selector: 'app-ventas',
  imports: [FormsModule],
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.css'],
})
export class Ventas {
  readonly clienteService = inject(ClienteService);
  readonly carritoService = inject(CarritoService);
  readonly ventaRealService = inject(VentaRealService);
  private http = inject(HttpClient); 
  readonly apiUrl = environment.apiUrl

  carritoItems = this.carritoService.carritoItems;
  subtotal = this.carritoService.subtotal;
  igv = this.carritoService.igv;
  total = this.carritoService.total;
  cantidadProductos = this.carritoService.cantidadProductos;


  busquedaCliente: string = '';
  clientesFiltrados: Cliente[] = [];
  mostrarSugerencias: boolean = false;
  clienteSeleccionado: Cliente | null = null;
  metodoPago: string = 'EFECTIVO';

  mostrarModalExito = false;
  ventaRealizadaId: number | null = null;

  eliminarDelCarrito(idProducto: number) {
    this.carritoService.eliminarProducto(idProducto);
  }

  incrementarCantidad(idProducto: number) {
    this.carritoService.incrementarCantidad(idProducto);
  }

  decrementarCantidad(idProducto: number) {
    this.carritoService.decrementarCantidad(idProducto);
  }

  limpiarCarrito() {
    this.carritoService.limpiarCarrito();
    this.clienteSeleccionado = null;
    this.busquedaCliente = '';
  }

  buscarCliente() {
    if (this.busquedaCliente.trim().length < 2) {
      this.clientesFiltrados = [];
      return;
    }

    this.clienteService.getClientes(this.busquedaCliente).subscribe({
      next: (res) => {
        this.clientesFiltrados = res.content || [];
      },
      error: (err) => console.error('Error al obtener clientes:', err),
    });
  }


  

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.busquedaCliente = cliente.nombreCliente;
    this.mostrarSugerencias = false;
  }

  ocultarSugerencias() {
    setTimeout(() => (this.mostrarSugerencias = false), 200);
  }
  
  descargarPDF() {
    if (!this.ventaRealizadaId) {
      console.error('No hay ID de venta para descargar PDF');
      return;
    }

    const url = `${this.apiUrl}/venta/${this.ventaRealizadaId}/pdf`;
    
    this.http.get(url, { 
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        const blob = new Blob([response.body!], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `venta-${this.ventaRealizadaId}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.cerrarModal();
      },
      error: (error) => {
        console.error('Error al descargar PDF:', error);
        alert('Error al descargar el PDF');
      }
    });
  }

  cerrarModal() {
    this.mostrarModalExito = false;
    this.ventaRealizadaId = null;
  }    

  confirmarVenta() {
    if (!this.clienteSeleccionado) {
      alert('Por favor selecciona un cliente');
      return;
    }

    if (this.carritoItems().length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const ventaRequest = this.ventaRealService.crearVentaRequest(
      this.clienteSeleccionado.idCliente,
      this.metodoPago
    );

    this.ventaRealService.registrarVenta(ventaRequest).subscribe({
      next: (response:any) => {
        console.log('Venta registrada:', response);

        this.ventaRealizadaId = response.ventaId || response.id;
        this.mostrarModalExito = true;
        this.limpiarCarrito();
      },
      error: (error) => {
        console.error('Error al registrar venta:', error);
        alert('Error al procesar la venta');
      }
    });
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