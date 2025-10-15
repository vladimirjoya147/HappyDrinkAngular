import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { RolesService } from '../../service/roles.service';
import { Roles } from '../../roles';

@Component({
  selector: 'app-roles-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.css']
})
export class RolesFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(RolesService);

  id = 0;
  loading = false;
  title = computed(() => (this.id ? 'Editar Rol' : 'Nuevo Rol'));

  form = this.fb.group({
    idRol: [0],
    nombreRol: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    const p = this.route.snapshot.paramMap.get('id');
    this.id = p ? Number(p) : 0;

    // asegura que el form tenga el id inmediatamente
    if (this.id) this.form.controls.idRol.setValue(this.id);

    if (this.id) {
      this.loading = true;
      this.service.getById(this.id)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (r: Roles | null) => {
            if (!r) return;
            this.form.patchValue({
              idRol: r.idRol ?? this.id,
              nombreRol: r.nombreRol ?? ''
            });
          }
        });
    }
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;

    // fuerza que el id NUNCA sea null
    const dto = {
      idRol: this.form.value.idRol ?? this.id,
      nombreRol: (this.form.value.nombreRol || '').trim()
    };

    const req$ = this.id
      ? this.service.update(dto)                          // PATCH /api/rol/actualizar
      : this.service.create({ nombreRol: dto.nombreRol }); // POST  /api/rol/guardar

    req$.pipe(take(1), finalize(() => this.loading = false))
        .subscribe({
          next: () => this.router.navigate(['/roles']),
          error: (err) => {
            console.error('Guardar error', err);
            alert(`No se pudo guardar (status ${err?.status ?? '??'}). Revisa Network.`);
          }
        });
  }

  onCancel(): void { this.router.navigate(['/roles']); }
}
