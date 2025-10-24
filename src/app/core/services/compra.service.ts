import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from 'src/app/Models/CompraRequest';
import { DetalleCompra } from 'src/app/Models/DetalleCompra';
@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private api : string = 'http://localhost:8080/api/compras';

  constructor(private http: HttpClient){}

  getComprasList():Observable<Compra[]>{
    return this.http.get<Compra[]>(this.api);
  }

  getDetalleCompras(busqueda: number):Observable<DetalleCompra[]>{
    return this.http.get<DetalleCompra[]>(`${this.api}/detalle/${busqueda}`)
  }
}
