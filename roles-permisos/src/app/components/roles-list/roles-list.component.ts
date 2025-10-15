import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink} from '@angular/router';
import { RolesService  } from '../../service/roles.service';
import { Roles } from '../../roles';


@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './roles-list.html',
  styleUrls: ['./roles-list.css']
})

export class RolesListComponent implements OnInit {
  roles: Roles[] = [];
  deletingId?: number;

  constructor(private rolesService: RolesService) {}

  ngOnInit() { this.listRoles(); }

  listRoles() {
    this.rolesService.getRolesList().subscribe(d => this.roles = d);
  }

  onDelete(r: Roles) {
    if (!confirm(`¿Eliminar el rol "${r.nombreRol}"?`)) return;
    this.deletingId = r.idRol;
    this.rolesService.delete(r.idRol).subscribe({
      next: () => this.listRoles(),
      error: (e) => console.error(e),
      complete: () => this.deletingId = undefined
    });
  }
}