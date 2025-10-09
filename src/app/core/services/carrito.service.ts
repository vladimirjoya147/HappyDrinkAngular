// services/carrito.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Productos as ProductoModel } from 'src/app/Models/Productos'; 

export interface DetalleVenta {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  producto?: ProductoModel;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito = signal<DetalleVenta[]>([]);
  

  carritoItems = this.carrito.asReadonly();

  subtotal = computed(() => {
  const totalConIgv = this.carrito().reduce((total, item) => 
    total + (item.precioUnitario * item.cantidad) - item.descuento, 0
  );

  return totalConIgv / 1.18;
});

igv = computed(() => {
  return this.subtotal() * 0.18;
});

total = computed(() => {
  return this.subtotal() + this.igv();
});

  cantidadProductos = computed(() => {
    return this.carrito().reduce((total, item) => total + item.cantidad, 0);
  });

  agregarProducto(producto: ProductoModel) {
    const carritoActual = this.carrito();
    const itemExistente = carritoActual.find(item => item.idProducto === producto.idProducto);

    if (itemExistente) {
      this.incrementarCantidad(producto.idProducto);
    } else {
      const nuevoItem: DetalleVenta = {
        idProducto: producto.idProducto,
        cantidad: 1,
        precioUnitario: producto.precioVenta,
        descuento: 0,
        producto: producto
      };
      this.carrito.update(items => [...items, nuevoItem]);
    }
  }

  eliminarProducto(idProducto: number) {
    this.carrito.update(items => items.filter(item => item.idProducto !== idProducto));
  }

  incrementarCantidad(idProducto: number) {
    this.carrito.update(items => 
      items.map(item => 
        item.idProducto === idProducto 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  }

  decrementarCantidad(idProducto: number) {
    this.carrito.update(items => 
      items.map(item => 
        item.idProducto === idProducto && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      ).filter(item => item.cantidad > 0)
    );
  }

  limpiarCarrito() {
    this.carrito.set([]);
  }
}