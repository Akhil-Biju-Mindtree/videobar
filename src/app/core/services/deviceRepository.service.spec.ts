import { TestBed } from '@angular/core/testing';

import { DeviceRepository } from './deviceRepository.service';
import { Logger } from '@core/logger/Logger';
import { UtilitiesService } from '@providers/utilities.service';
import { QueueService } from '@providers/queue.service';

describe('DeviceRepository service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: Logger, useValue: {} },
        { provide: UtilitiesService, useValue: {} },
        { provide: QueueService, useValue: {} },
      ],
    });
  });

  it('should be created', () => {
    const dr: DeviceRepository = TestBed.get(DeviceRepository);
    expect(dr).toBeTruthy();
  });
});
