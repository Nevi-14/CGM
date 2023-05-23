import { TestBed } from '@angular/core/testing';

import { ConfiguracionesServiceService } from './configuraciones-service.service';

describe('ConfiguracionesServiceService', () => {
  let service: ConfiguracionesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracionesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
