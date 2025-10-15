import { Component, OnInit } from '@angular/core';
import { Permisos } from '../Models/Permisos';
import { PermisoService } from '../core/services/permiso.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar.component/navbar.component';

@Component({
  selector: 'app-permiso-list',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './permisoscomponent.html',
  styleUrls: ['./permisoscomponent.css']
})
export class PermisoListComponent implements OnInit {

  permisos : Permisos [] = [];

  constructor(
    private permisoService : PermisoService
  ){}
  
  ngOnInit(): void {
    this.listPermisos();
  }

  listPermisos(){
    this.permisoService.getPermisoList().subscribe(
      data => {
        this.permisos = data
        console.log(this.permisos);
      }
    );
  }

}