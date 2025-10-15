import { Component, OnInit } from '@angular/core';
import { Cliente } from '../Models/Cliente';
import { ClientesService } from '../core/services/clientes.service';
import { NavbarComponent } from '../navbar.component/navbar.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [{
    idCliente: 1,
    nombreCliente: "Juan Perez",
    documentoIdentidad: "12345678",
    telefono: "987654321",
    email: "juan@gmail.com",
    direccion: "Calle Falsa 123",
    activo: 1
  }];


  constructor(private clienteService: ClientesService) { }
  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data.content;
      console.log("Clientes cargados:", this.clientes);
      },
      error: (error) => console.error("Error al cargar clientes", error)
    }
    )
  }

}




