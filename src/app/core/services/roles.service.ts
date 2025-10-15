import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/app/Models/Roles';

@Injectable({ providedIn: 'root' })
export class RolesService {

  private api = 'http://localhost:8080/api/rol';

  constructor(private http: HttpClient) {}

  getRolesList(): Observable<Roles[]> {
    return this.http.get<Roles[]>(this.api);
  }

  getById(id: number): Observable<Roles> {
    return this.http.get<Roles>(`${this.api}/${id}`);
  }

  create(dto: { nombreRol: string }): Observable<Roles> {
    
    return this.http.post<Roles>(`${this.api}/guardar`, dto);
  }

  update(dto: { idRol: number; nombreRol: string }): Observable<Roles> {
    return this.http.patch<Roles>(`${this.api}/actualizar`, dto);
  }

  delete(id: number) { 
    return this.http.delete<Roles>(`${this.api}/${id}`);
  }
}