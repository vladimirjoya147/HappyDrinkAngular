import { Component, OnInit } from '@angular/core';
import { Permisos } from '../../permisos';
import { PermisoService } from '../../service/permisos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permiso-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './permiso-list.html',
  styleUrls: ['./permiso-list.css']
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
