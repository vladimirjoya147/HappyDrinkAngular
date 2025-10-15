import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService, ProductoRequestDTO, ProductoResponseDTO } from '../core/services/productosdetails.service';
import { CategoriaService, CategoriaResponseDTO } from '../core/services/categoria.service';
import { ProveedorService, ProveedorResponseDTO } from '../core/services/proveedor.service';
import { NavbarComponent } from '../navbar.component/navbar.component';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './productosdetails.component.html',
})
export class ProductosDetailsComponent implements OnInit {

  productos: ProductoResponseDTO[] = [];
  categorias: CategoriaResponseDTO[] = [];
  proveedores: ProveedorResponseDTO[] = [];

  paginaActual = 0;
  tamanio = 10;
  totalPaginas = 0;

  busqueda = '';

  // Formulario nuevo producto
  nuevo: ProductoRequestDTO = {
    codigoBarra: '',
    nombre: '',
    descripcion: '',
    idCategoria: 0,
    idProveedorPreferido: 0,
    precioCompra: 0,
    precioVenta: 0,
    stock: 0,
    stockMinimo: 5,
    activo: true,
    path: ''
  };

  // Edición
  edit: ProductoRequestDTO & { idProducto?: number } = {
    codigoBarra: '',
    nombre: '',
    descripcion: '',
    idCategoria: 0,
    idProveedorPreferido: 0,
    precioCompra: 0,
    precioVenta: 0,
    stock: 0,
    stockMinimo: 5,
    activo: true,
    path: ''
  };
  editIndex: number | null = null;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarProveedores();
  }

  cargarProductos(pagina: number = this.paginaActual): void {
    this.productoService.listarProductos(pagina, this.tamanio, 'nombre').subscribe({
      next: (data: any) => {
        this.productos = data.contenido ?? data.content ?? [];
        this.totalPaginas = data.totalPaginas ?? data.totalPages ?? 0;
      },
      error: err => console.error('Error al cargar productos', err)
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: data => this.categorias = data,
      error: err => console.error('Error al cargar categorías', err)
    });
  }

  cargarProveedores(): void {
    this.proveedorService.listarProveedores().subscribe({
      next: data => this.proveedores = data,
      error: err => console.error('Error al cargar proveedores', err)
    });
  }

  // Guardar nuevo producto
  guardar(): void {
    if (!this.nuevo.nombre || !this.nuevo.codigoBarra) {
      alert('Nombre y código de barra son obligatorios.');
      return;
    }

    this.productoService.guardarProducto(this.nuevo).subscribe({
      next: () => {
        alert('✅ Producto guardado correctamente');
        this.resetNuevo();
        this.cargarProductos(0);
      },
      error: err => {
        console.error('Error al guardar producto', err);
        alert('Error al guardar producto.');
      }
    });
  }

  resetNuevo(): void {
    this.nuevo = {
      codigoBarra: '',
      nombre: '',
      descripcion: '',
      idCategoria: 0,
      idProveedorPreferido: 0,
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      stockMinimo: 5,
      activo: true,
      path: ''
    };
  }

  // Abrir modal edición
  abrirModalEdicion(prod: ProductoResponseDTO, index: number): void {
    this.edit = {
      idProducto: prod.idProducto,
      codigoBarra: prod.codigoBarra,
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      idCategoria: prod.idCategoria ?? 0,
      idProveedorPreferido: prod.idProveedorPreferido ?? 0,
      precioCompra: Number(prod.precioCompra),
      precioVenta: Number(prod.precioVenta),
      stock: prod.stock ?? 0,
      stockMinimo: prod.stockMinimo ?? 5,
      activo: prod.activo,
      path: prod.path ?? ''
    };
    this.editIndex = index;

    const modalEl = document.getElementById('modalEdicion');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  // Guardar edición
  guardarEdicion(): void {
    if (this.editIndex === null) return;
    this.productoService.actualizarProducto(this.edit).subscribe({
      next: updated => {
        this.productos[this.editIndex!] = updated;
        this.editIndex = null;
        const modalEl = document.getElementById('modalEdicion');
        if (modalEl) {
          const modalInstance = (window as any).bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
      },
      error: err => {
        console.error('Error al editar producto', err);
        alert('Error al editar producto.');
      }
    });
  }

  // Activar / Desactivar producto
  toggleEstado(prod: ProductoResponseDTO): void {
    if (!prod.idProducto) return;
    this.productoService.cambiarEstado(prod.idProducto, !prod.activo).subscribe({
      next: updated => prod.activo = updated.activo,
      error: err => {
        console.error('Error al cambiar estado', err);
        alert('No se pudo cambiar el estado del producto.');
      }
    });
  }

  // Eliminar (desactivar) producto
  eliminarProducto(index: number): void {
    const prod = this.productos[index];
    if (!prod || !prod.idProducto) return;

    if (!confirm(`¿Seguro que deseas eliminar el producto "${prod.nombre}"?`)) {
      return;
    }

    this.productoService.cambiarEstado(prod.idProducto, false).subscribe({
      next: updated => {
        this.productos[index].activo = updated.activo;
        alert(`Producto "${prod.nombre}" eliminado/desactivado correctamente.`);
      },
      error: err => {
        console.error('Error al eliminar producto', err);
        alert('No se pudo eliminar el producto.');
      }
    });
  }

  // Paginación
  paginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.busqueda ? this.buscar() : this.cargarProductos(this.paginaActual);
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
      this.busqueda ? this.buscar() : this.cargarProductos(this.paginaActual);
    }
  }

  // Buscar por nombre o código
  buscar(): void {
    this.paginaActual = 0;
    if (!this.busqueda) {
      this.cargarProductos(0);
      return;
    }

    this.productoService.buscarPorNombreOCodigo(this.busqueda, this.paginaActual, this.tamanio)
      .subscribe({
        next: (data: any) => {
          this.productos = data.contenido ?? data.content ?? [];
          this.totalPaginas = data.totalPaginas ?? data.totalPages ?? 0;
        },
        error: err => console.error('Error al buscar productos', err)
      });
  }
}