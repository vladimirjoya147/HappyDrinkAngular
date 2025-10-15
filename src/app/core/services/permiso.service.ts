import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Permisos } from 'src/app/Models/Permisos';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  private api : string = 'http://localhost:8080/api/permiso';

  constructor(private http: HttpClient){}

  getPermisoList():Observable<Permisos []>{
    return this.http.get<Permisos[]>(this.api);
  }
  
}