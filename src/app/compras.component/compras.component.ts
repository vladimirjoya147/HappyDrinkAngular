import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar.component/navbar.component';
import { Compra } from '../Models/CompraRequest';
import { CompraService } from '../core/services/compra.service'; 
import { OnInit } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common'; 
import { DetalleCompra } from '../Models/DetalleCompra';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [NavbarComponent,DatePipe, CurrencyPipe],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent {
    compras : Compra [] = [];
    detalles: DetalleCompra[] = [];
    compraSeleccionada: number | null = null;
    
      constructor(
        private CompraService : CompraService
      ){}

      ngOnInit():void{
          this.listarCompras()
      }

      listarCompras(){
          this.CompraService.getComprasList().subscribe(
            data=> {
              this.compras = data
              console.log(this.compras)
            }
          )
      }

      
  abrirDetalles(idCompra: number): void {
    this.compraSeleccionada = idCompra;
    this.CompraService.getDetalleCompras(idCompra).subscribe({
      next: data => this.detalles = data,
      error: err => {
        console.error('Error al obtener detalles:', err);
        this.detalles = [];
      }
    });
  }
}
