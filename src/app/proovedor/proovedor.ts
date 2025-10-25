import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Proovedor } from '../Models/proovedor.model';
import { ProveedorRequestDTO, ProveedorResponseDTO, ProveedorService } from '../core/services/proveedor.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar.component/navbar.component';
import { FormsModule } from '@angular/forms';

declare const Swal: any;

@Component({
  selector: 'app-proovedor',
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './proovedor.html',
  styleUrl: './proovedor.css'
})
export class ProovedorComponent implements OnInit {

  proovedores: ProveedorResponseDTO[] = [];
  proovedorSeleccionado?: ProveedorResponseDTO;
  busqueda: string = '';

  formProovedor: ProveedorRequestDTO = {
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
    this.listarProovedor();
  }

  listarProovedor(): void {
    this.proovedorService.listarProveedores().subscribe(
      {
        next: (data) => {
          this.proovedores = data; // Ya tiene el tipo ProveedorResponseDTO[]
          console.log('Proovedores cargados:', this.proovedores);
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
      this.listarProovedor();
      return;
    }

    this.proovedorService.buscarProveedores(this.busqueda).subscribe({
      next: (data) => {
        this.proovedores = data;
        console.log('Resultado búsqueda:', this.proovedores);
      },
      error: (error) => {
        console.error('Error al buscar proveedores', error);
        Swal.fire('Error', 'No se pudo buscar proveedores', 'error');
      }
    });
  }

  guardarProovedor(): void {
    if (!this.formProovedor.nombreProveedor?.trim() || !this.formProovedor.ruc?.trim()) {
      Swal.fire('Atención', 'El Nombre y RUC son obligatorios', 'warning');
      return;
    }

    const action = this.isEditMode ? 'Actualizar' : 'Guardar';
    
    Swal.fire({
      title: this.isEditMode ? 'Actualizando...' : 'Guardando...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    // Como formProovedor ya es ProveedorRequestDTO, lo usamos directamente como payload
    const payload: ProveedorRequestDTO = this.formProovedor; 

    const serviceCall = this.isEditMode
      ? this.proovedorService.actualizarProveedor(payload)
      : this.proovedorService.guardarProveedor(payload);

    serviceCall.subscribe({
        next: () => {
          Swal.close();
          Swal.fire('Listo', `${action} proveedor exitoso`, 'success');
          this.cerrarModalCrearEditar();
          this.listarProovedor();
        },
        error: (err) => {
          console.error(`Error al ${action.toLowerCase()}`, err);
          Swal.close();
          Swal.fire('Error', `No se pudo ${action.toLowerCase()} el proveedor`, 'error');
        }
    });
  }

  cambiarEstadoProovedor(proovedor: ProveedorResponseDTO): void {
    const nuevoEstado = !proovedor.activo;
    const accionTexto = nuevoEstado ? 'activar' : 'desactivar';

    Swal.fire({
      title: `¿Seguro que deseas ${accionTexto} al proveedor ${proovedor.nombreProveedor}?`,
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
        this.proovedorService.cambiarEstado(proovedor.idProveedor, nuevoEstado)
          .pipe(finalize(() => Swal.close()))
          .subscribe({
            next: () => {
              Swal.fire('Listo', `Proveedor ${accionTexto} correctamente`, 'success');
              this.listarProovedor();
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
    this.formProovedor = {
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
  abrirModalEditar(proovedor: ProveedorResponseDTO): void {
    this.isEditMode = true;
    // Clonamos el ResponseDTO al RequestDTO del formulario
    this.formProovedor = { ...proovedor };
    this.abrirModal(this.modalCrearEditarRef);
  }

  // Recibimos un ResponseDTO para el detalle
  abrirModalDetalle(proovedor: ProveedorResponseDTO): void {
    this.proovedorSeleccionado = proovedor;
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
    this.listarProovedor();
  }
}
