import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../Models/Cliente';
import { PageResponse } from 'src/app/Models/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = 'http://localhost:8080/api/cliente';

  constructor(private http: HttpClient) { }

  getClientes(): Observable<PageResponse<Cliente>> {
    return this.http.get<PageResponse<Cliente>>(this.apiUrl);
  }
    
}
