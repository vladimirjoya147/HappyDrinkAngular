import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Permisoscomponent } from './permisoscomponent';

describe('Permisoscomponent', () => {
  let component: Permisoscomponent;
  let fixture: ComponentFixture<Permisoscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Permisoscomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Permisoscomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
