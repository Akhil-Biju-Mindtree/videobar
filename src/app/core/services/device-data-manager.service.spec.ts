import { inject, TestBed } from '@angular/core/testing';
import { DeviceDataManagerService } from './device-data-manager.service';
import { CachingService } from './caching.service';
import { DeviceService } from './device.service';

let mockService;
describe('DeviceDataManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeviceDataManagerService,
        { provide: CachingService, useValue: {} },
        { provide: DeviceService, useValue: {} },
      ],
    });
  });

  beforeEach(inject([DeviceDataManagerService], (service) => {
    mockService = service;
  }));

  it('Should have DeviceDataManager service', () => {
    expect(mockService).toBeTruthy();
  });
});
