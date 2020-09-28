import { TestBed } from '@angular/core/testing';

import { MapperService } from './mapper.service';
import { Logger } from '@core/logger/Logger';

describe('MapperService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{ provide: Logger, useValue: {} }],
    }),
  );

  it('should be created', () => {
    const service: MapperService = TestBed.get(MapperService);
    expect(service).toBeTruthy();
  });
});
