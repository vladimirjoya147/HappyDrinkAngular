import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { Cliente } from '../Models/Cliente';
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

  // Form model para crear/editar
  formCliente: Cliente = {
    nombreCliente: '',
    documentoIdentidad: '',
    telefono: '',
    email: '',
    direccion: '',
    activo: 1
  };

  isEditMode: boolean = false;

  // referencias a los modales en el template
  @ViewChild('modalCrearEditar') modalCrearEditarRef!: ElementRef<HTMLDivElement>;
  @ViewChild('modalDetalle') modalDetalleRef!: ElementRef<HTMLDivElement>;

  constructor(private clienteService: ClientesService) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  // -----------------------
  // Operaciones con el servicio
  // -----------------------

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
    // usamos la ruta /listar
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

  buscarClientePorId(id: number): void {
    this.clienteService.getClientePorId(id).subscribe({
      next: (cliente) => {
        this.clienteSeleccionado = cliente;
        console.log('Cliente encontrado:', cliente);
      },
      error: (error) => {
        console.error('Error al buscar cliente por ID', error);
        Swal.fire('Error', 'No se pudo obtener el cliente', 'error');
      }
    });
  }

guardarCliente(): void {
  // validaciones mínimas 
  if (!this.formCliente.nombreCliente?.trim()) {
    Swal.fire('Atención', 'El nombre es obligatorio', 'warning');
    return;
  }

  const action = this.isEditMode ? 'Actualizar' : 'Guardar';

  // <-- mostrar modal de carga antes de llamar al servicio
  Swal.fire({
    title: this.isEditMode ? 'Actualizando...' : 'Guardando...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  if (this.isEditMode) {
    this.clienteService.actualizarCliente(this.formCliente).subscribe({
      next: (res) => {
        // cerrar loader y mostrar éxito
        Swal.close();
        Swal.fire('Listo', `${action} cliente exitoso`, 'success');
        this.cerrarModalCrearEditar();
        this.cargarClientes();
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        // cerrar loader y mostrar error
        Swal.close();
        Swal.fire('Error', 'No se pudo actualizar el cliente', 'error');
      }
    });
  } else {
    this.clienteService.guardarCliente(this.formCliente).subscribe({
      next: (res) => {
        // cerrar loader y mostrar éxito
        Swal.close();
        Swal.fire('Listo', `${action} cliente exitoso`, 'success');
        this.cerrarModalCrearEditar();
        this.cargarClientes();
      },
      error: (err) => {
        console.error('Error al guardar', err);
        // cerrar loader y mostrar error
        Swal.close();
        Swal.fire('Error', 'No se pudo guardar el cliente', 'error');
      }
    });
  }
}

  cambiarEstadoCliente(cliente: Cliente): void {
  const nuevoEstado = cliente.activo ? false : true;
  const accionTexto = nuevoEstado ? 'activar' : 'eliminar (desactivar)';

  // 1: confirmar con el usuario antes de continuar
  Swal.fire({
    title: `¿Seguro que deseas ${accionTexto} al cliente?`,
    text: nuevoEstado
      ? 'El cliente volverá a estar activo en el sistema.'
      : `El cliente ${cliente.nombreCliente} será marcado como inactivo, pero no se eliminará definitivamente.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result: any) => {
    if (result.isConfirmed) {
      //  2: mostrar loader mientras se procesa
      Swal.fire({
        title: nuevoEstado ? 'Activando...' : 'Eliminando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      this.clienteService.activarDesactivarCliente(cliente.idCliente!, nuevoEstado)
        .pipe(finalize(() => Swal.close()))
        .subscribe({
          next: () => {
            Swal.fire(
              'Listo',
              `Cliente ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
              'success'
            );
            this.cargarClientes();
          },
          error: (err) => {
            console.error('Error al cambiar estado', err);
            Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
          }
        });
    } else {
      // Si cancela, no hacemos nada
      Swal.fire('Cancelado', 'No se realizó ningún cambio.', 'info');
    }
  });
}



  // -----------------------
  // Modales: abrir / cerrar
  // -----------------------

  abrirModalCrearNuevo(): void {
    this.isEditMode = false;
    this.formCliente = {
      nombreCliente: '',
      documentoIdentidad: '',
      telefono: '',
      email: '',
      direccion: '',
      activo: 1
    };
    this.abrirModal(this.modalCrearEditarRef);
  }

  abrirModalEditar(cliente: Cliente): void {
    this.isEditMode = true;
    // clonamos para no mutar la lista hasta confirmar
    this.formCliente = { ...cliente };
    this.abrirModal(this.modalCrearEditarRef);
  }

  abrirModalDetalle(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.abrirModal(this.modalDetalleRef);
  }

  // función genérica para mostrar modal bootstrap
  private abrirModal(modalRef: ElementRef<HTMLDivElement>): void {
    const el = modalRef.nativeElement;
    const bsModal = new (window as any).bootstrap.Modal(el);
    bsModal.show();
  }

  cerrarModalCrearEditar(): void {
    // ocultar modal
    const el = this.modalCrearEditarRef.nativeElement;
    const modalInstance = (window as any).bootstrap.Modal.getInstance(el);
    modalInstance?.hide();
  }

  cerrarModalDetalle(): void {
    const el = this.modalDetalleRef.nativeElement;
    const modalInstance = (window as any).bootstrap.Modal.getInstance(el);
    modalInstance?.hide();
  }

  // -----------------------
  // Utilidades UI
  // -----------------------

  refrescar(): void {
    this.busqueda = '';
    this.cargarClientes();
  }

}
