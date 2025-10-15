import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../core/services/categoria.service';
import { CategoriaRequestDTO, CategoriaResponseDTO } from '../core/services/categoria.service';
import { NavbarComponent } from '../navbar.component/navbar.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './categoria.component.html',
})
export class CategoriasComponent implements OnInit {

  categorias: CategoriaResponseDTO[] = [];
  busqueda: string = '';


  nueva: CategoriaRequestDTO = {
    nombre: '',
    activo: true
  };


  edit: CategoriaResponseDTO = {
    idCategoria: 0,
    nombre: '',
    activo: true
  };
  editIndex: number | null = null;

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: data => this.categorias = data,
      error: err => console.error('❌ Error al cargar categorías', err)
    });
  }

  buscar(): void {
    const valor = this.busqueda.trim();
    if (!valor) {
      this.cargarCategorias();
      return;
    }

    const idBusqueda = Number(valor);
    if (!isNaN(idBusqueda)) {
      // Buscar por ID
      this.categoriaService.obtenerPorId(idBusqueda).subscribe({
        next: data => this.categorias = [data],
        error: err => {
          console.error('❌ No se encontró categoría con ese ID', err);
          this.categorias = [];
        }
      });
    } else {
      // Buscar por nombre localmente
      this.categorias = this.categorias.filter(cat =>
        cat.nombre.toLowerCase().includes(valor.toLowerCase())
      );
    }
  }

  guardar(): void {
    this.categoriaService.guardarCategoria(this.nueva).subscribe({
      next: () => {
        alert('✅ Categoría guardada correctamente');
        this.nueva = { nombre: '', activo: true };
        this.cargarCategorias();
      },
      error: err => console.error('❌ Error al guardar categoría', err)
    });
  }

  abrirModalEdicion(cat: CategoriaResponseDTO, index: number): void {
    this.edit = { ...cat };
    this.editIndex = index;


    const modalEl = document.getElementById('modalEdicionCategoria');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  guardarEdicion(): void {
    if (this.editIndex !== null) {
      this.categoriaService.actualizarCategoria(this.edit).subscribe({
        next: updated => {
          this.categorias[this.editIndex!] = { ...updated };
          this.editIndex = null;


          const modalEl = document.getElementById('modalEdicionCategoria');
          if (modalEl) {
            const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
            modal?.hide();
          }
        },
        error: err => console.error('❌ Error al editar categoría', err)
      });
    }
  }

  toggleEstado(cat: CategoriaResponseDTO): void {
    this.categoriaService.cambiarEstado(cat.idCategoria).subscribe({
      next: updated => cat.activo = updated.activo,
      error: err => console.error('❌ Error al cambiar estado', err)
    });
  }

  eliminarCategoria(index: number): void {
    const cat = this.categorias[index];
    if (!cat || !cat.idCategoria) return;
    if (!confirm('¿Deseas eliminar esta categoría?')) return;

    this.categoriaService.cambiarEstado(cat.idCategoria).subscribe({
      next: updated => this.categorias[index].activo = updated.activo,
      error: err => console.error('❌ Error al eliminar categoría', err)
    });
  }
}