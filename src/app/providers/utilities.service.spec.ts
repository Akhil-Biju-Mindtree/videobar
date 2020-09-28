import { TestBed } from '@angular/core/testing';
import { Logger } from '@core/logger/Logger';
import { UtilitiesService } from './utilities.service';
import { ProcessJsonResponseService } from './process-json-response.service';

describe('UtilitiesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: Logger, useValue: {} },
        { provide: ProcessJsonResponseService, useValue: {} },
      ],
    }),
  );

  it('should be created', () => {
    const service: UtilitiesService = TestBed.get(UtilitiesService);
    expect(service).toBeTruthy();
  });
});
