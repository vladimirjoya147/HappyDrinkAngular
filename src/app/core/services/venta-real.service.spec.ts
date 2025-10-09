import { TestBed } from '@angular/core/testing';

import { VentaRealService } from './venta-real.service';

describe('VentaRealService', () => {
  let service: VentaRealService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentaRealService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
