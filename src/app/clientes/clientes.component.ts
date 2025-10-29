import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../Models/Cliente'; // Asumo que el modelo Cliente existe
import { ClientesService } from '../core/services/clientes.service';
import { NavbarComponent } from '../navbar.component/navbar.component';
import { finalize } from 'rxjs';
declare const Swal: any;

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  clienteSeleccionado?: Cliente;
  busqueda: string = '';

  // Ajustamos 'activo' para que el modelo interno de Angular sea un booleano (true/false)
  // Esto es más limpio para el formulario y el @for.
  formCliente: Cliente = {
    nombreCliente: '',
    documentoIdentidad: '',
    telefono: '',
    email: '',
    direccion: '',
    activo: true as any // Usar 'true' y luego mapearlo a '1' o 'true' si es necesario antes de enviar al servicio
  };

  isEditMode: boolean = false;

  @ViewChild('modalCrearEditar') modalCrearEditarRef!: ElementRef<HTMLDivElement>;
  @ViewChild('modalDetalle') modalDetalleRef!: ElementRef<HTMLDivElement>;

  constructor(private clienteService: ClientesService) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  // --- Lógica del Componente (sin cambios funcionales, solo se conserva) ---

  cargarClientes(pagina: number = 0): void {
    this.clienteService.getClientes(pagina).subscribe({
      next: (data) => {
        this.clientes = data.content || [];
        console.log('Clientes cargados:', this.clientes);
      },
      error: (error) => {
        console.error('Error al cargar clientes', error);
        Swal.fire('Error', 'No se pudo cargar clientes', 'error');
      }
    });
  }

  buscarClientes(): void {
    if (!this.busqueda.trim()) {
      this.cargarClientes();
      return;
    }
    this.clienteService.buscarClientes(this.busqueda).subscribe({
      next: (data) => {
        this.clientes = data.content || [];
        console.log('Resultado búsqueda:', this.clientes);
      },
      error: (error) => {
        console.error('Error al buscar clientes', error);
        Swal.fire('Error', 'No se pudo buscar clientes', 'error');
      }
    });
  }

  guardarCliente(): void {
    if (!this.formCliente.nombreCliente?.trim()) {
      Swal.fire('Atención', 'El nombre es obligatorio', 'warning');
      return;
    }

    const action = this.isEditMode ? 'Actualizar' : 'Guardar';
    Swal.fire({
      title: this.isEditMode ? 'Actualizando...' : 'Guardando...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    // Nota: Aquí se debería mapear this.formCliente.activo de booleano a 1/0 si el backend lo espera así.
    // Para simplificar, asumimos que el servicio o el modelo Cliente maneja la conversión.

    const serviceCall = this.isEditMode
      ? this.clienteService.actualizarCliente(this.formCliente)
      : this.clienteService.guardarCliente(this.formCliente);

    serviceCall.subscribe({
      next: () => {
        Swal.close();
        Swal.fire('Listo', `${action} cliente exitoso`, 'success');
        this.cerrarModalCrearEditar();
        this.cargarClientes();
      },
      error: (err) => {
        console.error(`Error al ${action.toLowerCase()}`, err);
        Swal.close();
        Swal.fire('Error', `No se pudo ${action.toLowerCase()} el cliente`, 'error');
      }
    });
  }

  cambiarEstadoCliente(cliente: Cliente): void {
    // Si activo es 1, queremos desactivar (false). Si es 0, queremos activar (true).
    // Usamos el valor booleano para la lógica, y dependemos del servicio para la conversión final.
    const nuevoEstadoBooleano = !(cliente.activo === true || cliente.activo === 1);
    const accionTexto = nuevoEstadoBooleano ? 'activar' : 'eliminar (desactivar)';

    // ... (El resto de la lógica de SweetAlert y el servicio se mantiene) ...

    Swal.fire({
      title: `¿Seguro que deseas ${accionTexto} al cliente?`,
      text: nuevoEstadoBooleano
        ? 'El cliente volverá a estar activo en el sistema.'
        : `El cliente ${cliente.nombreCliente} será marcado como inactivo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: nuevoEstadoBooleano ? 'Activando...' : 'Eliminando...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        this.clienteService.activarDesactivarCliente(cliente.idCliente!, nuevoEstadoBooleano as any)
          .pipe(finalize(() => Swal.close()))
          .subscribe({
            next: () => {
              Swal.fire(
                'Listo',
                `Cliente ${nuevoEstadoBooleano ? 'activado' : 'desactivado'} correctamente`,
                'success'
              );
              this.cargarClientes();
            },
            error: (err) => {
              console.error('Error al cambiar estado', err);
              Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
            }
          });
      }
    });
  }


  abrirModalCrearNuevo(): void {
    this.isEditMode = false;
    this.formCliente = {
      nombreCliente: '',
      documentoIdentidad: '',
      telefono: '',
      email: '',
      direccion: '',
      activo: true as any // Usar true para el formulario de creación
    };
    this.abrirModal(this.modalCrearEditarRef);
  }

  abrirModalEditar(cliente: Cliente): void {
    this.isEditMode = true;
    // Clonamos y nos aseguramos de que 'activo' sea un booleano para el formulario
    this.formCliente = { ...cliente, activo: (cliente.activo === 1 || cliente.activo === true) as any };
    this.abrirModal(this.modalCrearEditarRef);
  }

  abrirModalDetalle(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.abrirModal(this.modalDetalleRef);
  }

  private abrirModal(modalRef: ElementRef<HTMLDivElement>): void {
    const el = modalRef.nativeElement;
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

  refrescar(): void {
    this.busqueda = '';
    this.cargarClientes();
  }

}