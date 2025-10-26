import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProveedorRequestDTO, ProveedorResponseDTO, ProveedorService } from '../core/services/proveedor.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar.component/navbar.component';
import { FormsModule } from '@angular/forms';

declare const Swal: any;

@Component({
  selector: 'app-proveedor',
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './proveedor.html',
  styleUrl: './proveedor.css'
})
export class ProveedorComponent implements OnInit {

  proveedores: ProveedorResponseDTO[] = [];
  proveedorSeleccionado?: ProveedorResponseDTO;
  busqueda: string = '';

  formProveedor: ProveedorRequestDTO = {
    idProveedor: undefined, // Opcional
    nombreProveedor: '',
    ruc: '',
    telefono: '',
    email: '',
    direccion: '',
    activo: true // Obligatorio
  };

  isEditMode: boolean = false;

  // Referencias a modales
  @ViewChild('modalCrearEditar') modalCrearEditarRef!: ElementRef<HTMLDivElement>;
  @ViewChild('modalDetalle') modalDetalleRef!: ElementRef<HTMLDivElement>;

  constructor(private proovedorService: ProveedorService) { }

  ngOnInit(): void {
    this.listarProveedor();
  }

  listarProveedor(): void {
    this.proovedorService.listarProveedores().subscribe(
      {
        next: (data) => {
          this.proveedores = data; // Ya tiene el tipo ProveedorResponseDTO[]
          console.log('Proveedores cargados:', this.proveedores);
        },
        error: (error) => {
          console.error('Error al cargar proveedores', error);
          Swal.fire('Error', 'No se pudo cargar proveedores', 'error');
        }
      }
    )
  }

  buscarProveedores(): void {
    if (!this.busqueda.trim()) {
      this.listarProveedor();
      return;
    }

    this.proovedorService.buscarProveedores(this.busqueda).subscribe({
      next: (data) => {
        this.proveedores = data;
        console.log('Resultado búsqueda:', this.proveedores);
      },
      error: (error) => {
        console.error('Error al buscar proveedores', error);
        Swal.fire('Error', 'No se pudo buscar proveedores', 'error');
      }
    });
  }

  guardarProveedor(): void {
    if (!this.formProveedor.nombreProveedor?.trim() || !this.formProveedor.ruc?.trim()) {
      Swal.fire('Atención', 'El Nombre y RUC son obligatorios', 'warning');
      return;
    }

    const action = this.isEditMode ? 'Actualizar' : 'Guardar';

    Swal.fire({
      title: this.isEditMode ? 'Actualizando...' : 'Guardando...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    // Como formProveedor ya es ProveedorRequestDTO, lo usamos directamente como payload
    const payload: ProveedorRequestDTO = this.formProveedor;

    const serviceCall = this.isEditMode
      ? this.proovedorService.actualizarProveedor(payload)
      : this.proovedorService.guardarProveedor(payload);

    serviceCall.subscribe({
        next: () => {
          Swal.close();
          Swal.fire('Listo', `${action} proveedor exitoso`, 'success');
          this.cerrarModalCrearEditar();
          this.listarProveedor();
        },
        error: (err) => {
          console.error(`Error al ${action.toLowerCase()}`, err);
          Swal.close();
          Swal.fire('Error', `No se pudo ${action.toLowerCase()} el proveedor`, 'error');
        }
    });
  }

  cambiarEstadoProveedor(proveedor: ProveedorResponseDTO): void {
    const nuevoEstado = !proveedor.activo;
    const accionTexto = nuevoEstado ? 'activar' : 'desactivar';

    Swal.fire({
      title: `¿Seguro que deseas ${accionTexto} al proveedor ${proveedor.nombreProveedor}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: nuevoEstado ? 'Activando...' : 'Desactivando...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        // idProveedor existe en ResponseDTO, usamos el operador '!' para afirmar
        this.proovedorService.cambiarEstado(proveedor.idProveedor, nuevoEstado)
          .pipe(finalize(() => Swal.close()))
          .subscribe({
            next: () => {
              Swal.fire('Listo', `Proveedor ${accionTexto} correctamente`, 'success');
              this.listarProveedor();
            },
            error: (err) => {
              console.error('Error al cambiar estado', err);
              Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
            }
          });
      }
    });
  }

// ----------------------------------------------------
// MODALES: ABRIR / CERRAR
// ----------------------------------------------------

  abrirModalCrearNuevo(): void {
    this.isEditMode = false;
    // Reseteamos el formulario con la estructura de ProveedorRequestDTO
    this.formProveedor = {
      nombreProveedor: '',
      ruc: '',
      telefono: '',
      email: '',
      direccion: '',
      activo: true,
      idProveedor: undefined
    };
    this.abrirModal(this.modalCrearEditarRef);
  }

  // Recibimos un ResponseDTO para editar
  abrirModalEditar(proveedor: ProveedorResponseDTO): void {
    this.isEditMode = true;
    // Clonamos el ResponseDTO al RequestDTO del formulario
    this.formProveedor = { ...proveedor };
    this.abrirModal(this.modalCrearEditarRef);
  }

  // Recibimos un ResponseDTO para el detalle
  abrirModalDetalle(proveedor: ProveedorResponseDTO): void {
    this.proveedorSeleccionado = proveedor;
    this.abrirModal(this.modalDetalleRef);
  }

  private abrirModal(modalRef: ElementRef<HTMLDivElement>): void {
    if (!modalRef) return; 
    const el = modalRef.nativeElement;
    // Asumimos que la librería Bootstrap está cargada globalmente
    const bsModal = new (window as any).bootstrap.Modal(el);
    bsModal.show();
  }

  cerrarModalCrearEditar(): void {
    const el = this.modalCrearEditarRef.nativeElement;
    const modalInstance = (window as any).bootstrap.Modal.getInstance(el);
    modalInstance?.hide();
  }

  cerrarModalDetalle(): void {
    const el = this.modalDetalleRef.nativeElement;
    const modalInstance = (window as any).bootstrap.Modal.getInstance(el);
    modalInstance?.hide();
  }

// ----------------------------------------------------
// UTILIDADES UI
// ----------------------------------------------------

  refrescar(): void {
    this.busqueda = '';
    this.listarProveedor();
  }
}
