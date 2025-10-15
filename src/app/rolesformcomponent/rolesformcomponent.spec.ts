import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rolesformcomponent } from './rolesformcomponent';

describe('Rolesformcomponent', () => {
  let component: Rolesformcomponent;
  let fixture: ComponentFixture<Rolesformcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rolesformcomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rolesformcomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
