import { TestBed } from '@angular/core/testing';
import { Logger } from '@core/logger/Logger';
import { QueueService } from './queue.service';

describe('QueueService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: Logger, useValue: {} },
      ],
    }),
  );

  it('should be created', () => {
    const service: QueueService = TestBed.get(QueueService);
    expect(service).toBeTruthy();
  });
});
