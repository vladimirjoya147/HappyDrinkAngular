import { Component } from '@angular/core';
import { ProductosComponent } from '../productosComponent/productosComponent'; 
import { Ventas } from '../ventas/ventas';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-principal',
  imports: [ProductosComponent, Ventas],
  templateUrl: './principal.html',
  styleUrl: './principal.css'
})
export class Principal {

}
