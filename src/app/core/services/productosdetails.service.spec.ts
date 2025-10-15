import { TestBed } from '@angular/core/testing';

import { ProductosdetailsService } from './productosdetails.service';

describe('ProductosdetailsService', () => {
  let service: ProductosdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductosdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
