import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosdetailsComponent } from './productosdetails.component';

describe('ProductosdetailsComponent', () => {
  let component: ProductosdetailsComponent;
  let fixture: ComponentFixture<ProductosdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
